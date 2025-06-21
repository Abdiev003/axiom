import { jest, describe, it, expect, beforeEach } from '@jest/globals';

// Mock the git utility functions
const mockGetStagedDiff = jest.fn();

// Mock the entire git module
jest.unstable_mockModule('../utils/git.js', () => ({
  getStagedDiff: mockGetStagedDiff
}));

// Import after mocking
const { getStagedDiff } = await import('../utils/git.js');

describe('Git Utils', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getStagedDiff', () => {
    it('should return staged diff when changes exist', async () => {
      const mockDiff = `diff --git a/test.js b/test.js
index 123..456 100644
--- a/test.js
+++ b/test.js
@@ -1,3 +1,4 @@
 const test = 'hello';
+const newVar = 'world';
 console.log(test);`;

      mockGetStagedDiff.mockResolvedValue(mockDiff);

      const result = await getStagedDiff();
      expect(result).toBe(mockDiff);
      expect(mockGetStagedDiff).toHaveBeenCalled();
    });

    it('should handle git command errors gracefully', async () => {
      mockGetStagedDiff.mockRejectedValue(new Error('not a git repository'));

      await expect(getStagedDiff()).rejects.toThrow('not a git repository');
    });

    it('should return null when no staged changes exist', async () => {
      mockGetStagedDiff.mockResolvedValue(null);

      const result = await getStagedDiff();
      expect(result).toBeNull();
    });
  });
}); 