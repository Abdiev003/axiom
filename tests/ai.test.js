import { jest, describe, it, expect, beforeEach } from '@jest/globals';

// Mock axios
const mockAxiosPost = jest.fn();

// Mock the axios module
jest.unstable_mockModule('axios', () => ({
  default: {
    post: mockAxiosPost
  }
}));

// Import after mocking
const { generateCommitMessage } = await import('../utils/ai.js');

describe('AI Utils', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Reset environment variables
    delete process.env.OPENAI_API_KEY;
  });

  describe('generateCommitMessage', () => {
    it('should generate commit message successfully', async () => {
      process.env.OPENAI_API_KEY = 'test-api-key';
      
      const mockResponse = {
        data: {
          choices: [{
            message: {
              content: 'feat(auth): add user authentication middleware'
            }
          }]
        }
      };

      mockAxiosPost.mockResolvedValue(mockResponse);

      const diff = `diff --git a/auth.js b/auth.js
index 123..456 100644
--- a/auth.js
+++ b/auth.js
@@ -1,3 +1,4 @@
 const express = require('express');
+const auth = require('./middleware/auth');
 const app = express();`;

      const result = await generateCommitMessage(diff);
      
      expect(result).toBe('feat(auth): add user authentication middleware');
      expect(mockAxiosPost).toHaveBeenCalledWith(
        'https://api.openai.com/v1/chat/completions',
        expect.objectContaining({
          model: 'gpt-3.5-turbo',
          messages: expect.arrayContaining([
            expect.objectContaining({
              role: 'system'
            }),
            expect.objectContaining({
              role: 'user',
              content: expect.stringContaining(diff)
            })
          ])
        }),
        expect.objectContaining({
          headers: expect.objectContaining({
            'Authorization': 'Bearer test-api-key',
            'Content-Type': 'application/json'
          })
        })
      );
    });

    it('should handle large diffs by truncating', async () => {
      process.env.OPENAI_API_KEY = 'test-api-key';
      
      const mockResponse = {
        data: {
          choices: [{
            message: {
              content: 'feat: add multiple components with extensive changes'
            }
          }]
        }
      };

      mockAxiosPost.mockResolvedValue(mockResponse);

      // Create a very large diff (simulate large file changes)
      const largeDiff = 'diff --git a/large-file.js b/large-file.js\n' +
        'index 123..456 100644\n' +
        '--- a/large-file.js\n' +
        '+++ b/large-file.js\n' +
        '@@ -1,1000 +1,1500 @@\n' +
        'A'.repeat(50000) + '\n' + // Very large content
        '+' + 'B'.repeat(50000); // More large content

      const result = await generateCommitMessage(largeDiff);
      
      expect(result).toBe('feat: add multiple components with extensive changes');
      
      // Verify the API was called with processed diff
      const apiCall = mockAxiosPost.mock.calls[0];
      const userMessage = apiCall[1].messages.find(msg => msg.role === 'user');
      
      // The API should have been called (processing worked)
      expect(mockAxiosPost).toHaveBeenCalled();
      expect(userMessage.content).toContain('COMMIT:');
    });

    it('should throw error when API key is missing', async () => {
      const diff = 'some diff content';
      
      await expect(generateCommitMessage(diff)).rejects.toThrow(
        'OpenAI API key not found. Please set the OPENAI_API_KEY environment variable.'
      );
    });

    it('should throw error when diff is empty', async () => {
      process.env.OPENAI_API_KEY = 'test-api-key';
      
      await expect(generateCommitMessage('')).rejects.toThrow(
        'No diff provided. Please provide a valid git diff string.'
      );
    });

    it('should handle token limit errors gracefully', async () => {
      process.env.OPENAI_API_KEY = 'test-api-key';
      
      const mockError = {
        response: {
          status: 400,
          data: {
            error: {
              message: 'This model\'s maximum context length is 16385 tokens. However, your messages resulted in 25100 tokens.'
            }
          }
        }
      };

      mockAxiosPost.mockRejectedValue(mockError);

      await expect(generateCommitMessage('some diff')).rejects.toThrow(
        'The changes are too large to analyze. Please try committing smaller changes or use a more specific git add command.'
      );
    });

    it('should handle API errors properly', async () => {
      process.env.OPENAI_API_KEY = 'test-api-key';
      
      const mockError = {
        response: {
          status: 401,
          data: {
            error: {
              message: 'Invalid API key'
            }
          }
        }
      };

      mockAxiosPost.mockRejectedValue(mockError);

      await expect(generateCommitMessage('some diff')).rejects.toThrow(
        'Invalid OpenAI API key. Please check your OPENAI_API_KEY environment variable.'
      );
    });

    it('should handle network errors', async () => {
      process.env.OPENAI_API_KEY = 'test-api-key';
      
      const mockError = {
        code: 'ENOTFOUND'
      };

      mockAxiosPost.mockRejectedValue(mockError);

      await expect(generateCommitMessage('some diff')).rejects.toThrow(
        'Unable to connect to OpenAI API. Please check your internet connection.'
      );
    });

    it('should handle very large diffs with summarization', async () => {
      process.env.OPENAI_API_KEY = 'test-api-key';
      
      const mockResponse = {
        data: {
          choices: [{
            message: {
              content: 'feat: add comprehensive project restructure'
            }
          }]
        }
      };

      mockAxiosPost.mockResolvedValue(mockResponse);

      // Create an extremely large diff that should trigger summarization
      const massiveDiff = Array(10000).fill(0).map((_, i) => 
        `diff --git a/file${i}.js b/file${i}.js
index 123..456 100644
--- a/file${i}.js
+++ b/file${i}.js
@@ -1,3 +1,4 @@
 const test${i} = 'hello';
+const newVar${i} = 'world';
 console.log(test${i});`
      ).join('\n\n');

      const result = await generateCommitMessage(massiveDiff);
      
      expect(result).toBe('feat: add comprehensive project restructure');
      
      // Verify the API was called with summarized diff
      const apiCall = mockAxiosPost.mock.calls[0];
      const userMessage = apiCall[1].messages.find(msg => msg.role === 'user');
      
      // The summarized diff should contain statistics
      expect(userMessage.content).toContain('COMMIT:');
      expect(userMessage.content).toContain('files');
      expect(userMessage.content).toContain('Files:');
    });
  });
}); 