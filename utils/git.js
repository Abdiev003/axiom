import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

/**
 * Get the current Git status
 * @returns {Promise<string>} Git status output
 */
export async function getGitStatus() {
  try {
    const { stdout } = await execAsync('git status --porcelain');
    return stdout.trim();
  } catch (error) {
    throw new Error(`Failed to get Git status: ${error.message}`);
  }
}

/**
 * Get the current Git diff (staged and unstaged)
 * @returns {Promise<{staged: string, unstaged: string}>} Git diff output
 */
export async function getGitDiff() {
  try {
    const [stagedResult, unstagedResult] = await Promise.all([
      execAsync('git diff --cached').catch(() => ({ stdout: '' })),
      execAsync('git diff').catch(() => ({ stdout: '' }))
    ]);
    
    return {
      staged: stagedResult.stdout.trim(),
      unstaged: unstagedResult.stdout.trim()
    };
  } catch (error) {
    throw new Error(`Failed to get Git diff: ${error.message}`);
  }
}

/**
 * Get the staged changes diff
 * @returns {Promise<string|null>} Git staged diff output, or null if no staged changes
 */
export async function getStagedDiff() {
  try {
    const { stdout } = await execAsync('git diff --staged');
    const diff = stdout.trim();
    return diff || null;
  } catch (error) {
    // Check if it's a "not a git repository" error or similar
    if (error.message.includes('not a git repository') || 
        error.message.includes('fatal:') ||
        error.code === 128) {
      throw new Error(`Failed to get staged diff: ${error.message}`);
    }
    // For other errors (like no staged changes), return null
    return null;
  }
}

/**
 * Check if current directory is a Git repository
 * @returns {Promise<boolean>} True if it's a Git repo
 */
export async function isGitRepository() {
  try {
    await execAsync('git rev-parse --git-dir');
    return true;
  } catch (error) {
    return false;
  }
}

/**
 * Get the current branch name
 * @returns {Promise<string>} Current branch name
 */
export async function getCurrentBranch() {
  try {
    const { stdout } = await execAsync('git branch --show-current');
    return stdout.trim();
  } catch (error) {
    throw new Error(`Failed to get current branch: ${error.message}`);
  }
}

/**
 * Stage all changes
 * @returns {Promise<void>}
 */
export async function stageAllChanges() {
  try {
    await execAsync('git add .');
  } catch (error) {
    throw new Error(`Failed to stage changes: ${error.message}`);
  }
}

/**
 * Commit changes with a message
 * @param {string} message - Commit message
 * @returns {Promise<void>}
 */
export async function commitChanges(message) {
  try {
    await execAsync(`git commit -m "${message}"`);
  } catch (error) {
    throw new Error(`Failed to commit changes: ${error.message}`);
  }
} 