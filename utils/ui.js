import inquirer from 'inquirer';
import ora from 'ora';
import chalk from 'chalk';

/**
 * Start a spinner with the given text
 * @param {string} text - Text to display with the spinner
 * @returns {Object} Ora spinner instance
 */
export function startSpinner(text) {
  const spinner = ora({
    text,
    color: 'cyan',
    spinner: 'dots'
  });
  spinner.start();
  return spinner;
}

/**
 * Mark a spinner as successful with a success message
 * @param {Object} spinner - Ora spinner instance
 * @param {string} text - Success message to display
 */
export function succeedSpinner(spinner, text) {
  spinner.succeed(text);
}

/**
 * Ask user for confirmation to proceed with the generated commit message
 * @param {string} commitMessage - AI-generated commit message to display and confirm
 * @returns {Promise<boolean>} True if user confirms, false otherwise
 */
export async function confirmCommit(commitMessage) {
  console.log(chalk.bold('\n📝 Generated commit message:'));
  console.log(chalk.green(`"${commitMessage}"`));
  console.log();

  const { confirmed } = await inquirer.prompt([
    {
      type: 'confirm',
      name: 'confirmed',
      message: 'Do you want to proceed with this commit message?',
      default: true
    }
  ]);

  return confirmed;
} 