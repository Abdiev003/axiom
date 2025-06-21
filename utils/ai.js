import axios from 'axios';

/**
 * Estimate token count for a given text (conservative approximation)
 * @param {string} text - Text to estimate tokens for
 * @returns {number} Estimated token count
 */
function estimateTokenCount(text) {
  // More conservative estimation: 1 token ≈ 3 characters
  // This accounts for code/diff tokens being more dense
  return Math.ceil(text.length / 3);
}

/**
 * Truncate diff to fit within token limits (aggressive approach)
 * @param {string} diff - Git diff content
 * @param {number} maxTokens - Maximum tokens allowed (default: 8000 to be very safe)
 * @returns {string} Truncated diff
 */
function truncateDiff(diff, maxTokens = 8000) {
  const estimatedTokens = estimateTokenCount(diff);
  
  if (estimatedTokens <= maxTokens) {
    return diff;
  }

  // Split diff into lines and be very selective
  const lines = diff.split('\n');
  const criticalLines = [];
  const changedLines = [];
  
  for (const line of lines) {
    // Only keep the most critical information
    if (line.startsWith('diff --git') || 
        line.startsWith('+++') || 
        line.startsWith('---')) {
      criticalLines.push(line);
    } else if (line.startsWith('+') || line.startsWith('-')) {
      // Limit changed lines to prevent massive diffs
      if (changedLines.length < 100) {
        changedLines.push(line);
      }
    }
  }

  // Start with critical lines only
  let truncatedDiff = criticalLines.join('\n');
  let currentTokens = estimateTokenCount(truncatedDiff);

  // Add changed lines very carefully
  for (const line of changedLines) {
    const lineTokens = estimateTokenCount(line);
    if (currentTokens + lineTokens <= maxTokens) {
      truncatedDiff += '\n' + line;
      currentTokens += lineTokens;
    } else {
      break;
    }
  }

  // If still too long, be very aggressive
  if (currentTokens > maxTokens) {
    const maxChars = maxTokens * 2; // Very conservative conversion
    truncatedDiff = truncatedDiff.substring(0, maxChars);
  }

  truncatedDiff += '\n\n... (diff truncated - showing key changes only)';
  return truncatedDiff;
}

/**
 * Create a minimal summary for very large changes
 * @param {string} diff - Git diff content
 * @returns {string} Minimal summarized diff
 */
function summarizeDiff(diff) {
  const lines = diff.split('\n');
  const stats = {
    filesChanged: 0,
    additions: 0,
    deletions: 0,
    files: []
  };

  let currentFile = null;

  for (const line of lines) {
    if (line.startsWith('diff --git')) {
      const match = line.match(/diff --git a\/(.+) b\/(.+)/);
      if (match) {
        currentFile = match[2];
        stats.files.push(currentFile);
        stats.filesChanged++;
      }
    } else if (line.startsWith('+') && !line.startsWith('+++')) {
      stats.additions++;
    } else if (line.startsWith('-') && !line.startsWith('---')) {
      stats.deletions++;
    }
  }

  // Create a very minimal summary to avoid token limits
  const fileList = stats.files.slice(0, 5).join(', ');
  const moreFiles = stats.files.length > 5 ? ` and ${stats.files.length - 5} more` : '';
  
  return `COMMIT: ${stats.filesChanged} files, +${stats.additions}/-${stats.deletions} lines
Files: ${fileList}${moreFiles}
Types: ${getFileTypes(stats.files).join(', ')}`;
}

/**
 * Get file types from file list
 * @param {string[]} files - List of file paths
 * @returns {string[]} Unique file extensions
 */
function getFileTypes(files) {
  const extensions = files
    .map(file => {
      const ext = file.split('.').pop();
      return ext && ext.length < 6 ? ext : 'other';
    })
    .filter((ext, index, arr) => arr.indexOf(ext) === index)
    .slice(0, 5); // Limit to 5 types
  
  return extensions.length > 0 ? extensions : ['mixed'];
}

/**
 * Generate a commit message based on git diff using OpenAI API
 * @param {string} diff - Git diff output from staged changes
 * @returns {Promise<string>} Generated commit message following Conventional Commits format
 * @throws {Error} When API key is missing, API request fails, or response is invalid
 */
export async function generateCommitMessage(diff) {
  const apiKey = process.env.OPENAI_API_KEY;
  
  if (!apiKey) {
    throw new Error('OpenAI API key not found. Please set the OPENAI_API_KEY environment variable.');
  }

  if (!diff || diff.trim() === '') {
    throw new Error('No diff provided. Please provide a valid git diff string.');
  }

  // Handle large diffs with aggressive token management
  let processedDiff = diff;
  const estimatedTokens = estimateTokenCount(diff);
  
  if (estimatedTokens > 10000) {
    // For very large diffs, create a minimal summary
    processedDiff = summarizeDiff(diff);
  } else if (estimatedTokens > 6000) {
    // For moderately large diffs, truncate aggressively
    processedDiff = truncateDiff(diff, 6000);
  } else if (estimatedTokens > 4000) {
    // For medium diffs, still truncate to be safe
    processedDiff = truncateDiff(diff, 4000);
  }
  
  // Final safety check - if still too large, create minimal summary
  const finalTokens = estimateTokenCount(processedDiff);
  if (finalTokens > 8000) {
    processedDiff = summarizeDiff(diff);
  }

  const systemPrompt = "You are an expert software developer and an expert in writing Git commit messages. Your task is to analyze the given code changes (git diff) and generate a concise, single-line commit message that follows the Conventional Commits specification. The message should be in the format `<type>(<scope>): <subject>`. Do not add any extra explanations, comments, or markdown formatting. Only return the raw commit message string.";

  const userPrompt = `Please analyze the following git diff and generate a commit message:\n\n${processedDiff}`;

  try {
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: systemPrompt
          },
          {
            role: 'user',
            content: userPrompt
          }
        ],
        max_tokens: 100,
        temperature: 0.3,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0
      },
      {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        },
        timeout: 30000
      }
    );

    // Extract the commit message from the response
    const commitMessage = response.data?.choices?.[0]?.message?.content?.trim();
    
    if (!commitMessage) {
      throw new Error('Invalid response from OpenAI API: No commit message generated.');
    }

    return commitMessage;

  } catch (error) {
    // Handle different types of errors
    if (error.response) {
      // API responded with error status
      const status = error.response.status;
      const errorMessage = error.response.data?.error?.message || 'Unknown API error';
      
      if (status === 401) {
        throw new Error('Invalid OpenAI API key. Please check your OPENAI_API_KEY environment variable.');
      } else if (status === 429) {
        throw new Error('OpenAI API rate limit exceeded. Please try again later.');
      } else if (status === 400 && errorMessage.includes('maximum context length')) {
        throw new Error('The changes are too large to analyze. Please try committing smaller changes or use a more specific git add command.');
      } else if (status >= 500) {
        throw new Error('OpenAI API server error. Please try again later.');
      } else {
        throw new Error(`OpenAI API error (${status}): ${errorMessage}`);
      }
    } else if (error.code === 'ECONNABORTED') {
      // Request timeout
      throw new Error('Request to OpenAI API timed out. Please check your internet connection and try again.');
    } else if (error.code === 'ENOTFOUND' || error.code === 'ECONNREFUSED') {
      // Network connectivity issues
      throw new Error('Unable to connect to OpenAI API. Please check your internet connection.');
    } else {
      // Other errors (including our custom errors)
      throw new Error(`Failed to generate commit message: ${error.message}`);
    }
  }
}

 