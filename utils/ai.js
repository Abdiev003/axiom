import axios from 'axios';

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

  const systemPrompt = "You are an expert software developer and an expert in writing Git commit messages. Your task is to analyze the given code changes (git diff) and generate a concise, single-line commit message that follows the Conventional Commits specification. The message should be in the format `<type>(<scope>): <subject>`. Do not add any extra explanations, comments, or markdown formatting. Only return the raw commit message string.";

  const userPrompt = `Please analyze the following git diff and generate a commit message:\n\n${diff}`;

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

 