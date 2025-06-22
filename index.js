#!/usr/bin/env node

import { Command } from "commander";
import { createRequire } from "module";
import { getStagedDiff, getCurrentBranch, getGitDiff } from "./utils/git.js";
import { generateCommitMessage, generateBranchName } from "./utils/ai.js";
import { startSpinner, succeedSpinner, confirmCommit, confirmBranch } from "./utils/ui.js";
import { exec } from "child_process";
import { promisify } from "util";

const require = createRequire(import.meta.url);
const packageJson = require("./package.json");
const execAsync = promisify(exec);

const program = new Command();

program
  .name("git-axiom")
  .description("An AI-powered tool to help with Git workflows")
  .version(packageJson.version);

program
  .command("commit")
  .description("Generate AI-powered commit messages")
  .action(async () => {
    let spinner;

    try {
      // Step a: Show spinner for analyzing staged files
      spinner = startSpinner("Analyzing staged files...");

      // Step b: Get staged diff
      const diff = await getStagedDiff();

      if (!diff) {
        if (spinner) spinner.fail("No staged changes found.");
        console.log('\n💡 Use "git add <files>" to stage your changes first.');
        return;
      }

      // Step c: Update spinner for AI generation
      spinner.text = "Generating commit message with AI...";

      // Step d: Generate commit message
      const commitMessage = await generateCommitMessage(diff);

      // Step e: Stop spinner with success
      succeedSpinner(spinner, "Commit message generated!");
      spinner = null; // Clear reference since spinner is now complete

      // Step f: Ask for user confirmation
      const shouldCommit = await confirmCommit(commitMessage);

      if (shouldCommit) {
        // Step g: Execute git commit
        const commitSpinner = startSpinner("Committing changes...");

        try {
          await execAsync(
            `git commit -m "${commitMessage.replace(/"/g, '\\"')}"`
          );
          succeedSpinner(commitSpinner, "Commit successful!");
          console.log(
            `\n✨ Successfully committed with message: "${commitMessage}"`
          );
        } catch (commitError) {
          commitSpinner.fail("Commit failed");
          throw new Error(`Git commit failed: ${commitError.message}`);
        }
      } else {
        // Step h: User cancelled
        console.log("\n❌ Commit cancelled.");
      }
    } catch (error) {
      // Comprehensive error handling
      if (spinner) {
        spinner.fail("Operation failed");
      }

      console.error("\n🚨 Error:", error.message);

      // Provide helpful suggestions based on error type
      if (error.message.includes("API key")) {
        console.log("\n💡 Please set your OpenAI API key:");
        console.log('   export OPENAI_API_KEY="your-api-key-here"');
      } else if (error.message.includes("not a git repository")) {
        console.log("\n💡 Make sure you are in a Git repository directory.");
      } else if (error.message.includes("rate limit")) {
        console.log(
          "\n💡 OpenAI API rate limit reached. Please try again later."
        );
      } else if (
        error.message.includes("network") ||
        error.message.includes("timeout")
      ) {
        console.log("\n💡 Check your internet connection and try again.");
      }

      process.exit(1);
    }
  });

program
  .command("branch")
  .description("Generate AI-powered branch names based on your changes")
  .option("-t, --type <type>", "branch type (feature, fix, hotfix, refactor, docs)", "feature")
  .action(async (options) => {
    let spinner;

    try {
      // Step 1: Get current branch to avoid conflicts
      const currentBranch = await getCurrentBranch();
      
      if (currentBranch !== "main" && currentBranch !== "master" && currentBranch !== "develop") {
        console.log(`⚠️  You are currently on branch "${currentBranch}"`);
        console.log("💡 Consider switching to main/master/develop before creating a new branch");
      }

      // Step 2: Analyze changes
      spinner = startSpinner("Analyzing your changes...");

      // Get both staged and unstaged changes for better context
      const { staged, unstaged } = await getGitDiff();
      const allChanges = staged || unstaged;

      if (!allChanges) {
        if (spinner) spinner.fail("No changes found to analyze.");
        console.log('\n💡 Make some changes to your code first, then run this command.');
        return;
      }

      // Step 3: Generate branch name with AI
      spinner.text = "Generating branch name with AI...";
      
      const branchName = await generateBranchName(allChanges, options.type);

      // Step 4: Show result and ask for confirmation
      succeedSpinner(spinner, "Branch name generated!");
      spinner = null;

      const shouldCreate = await confirmBranch(branchName, options.type);

      if (shouldCreate) {
        // Step 5: Create the branch
        const createSpinner = startSpinner("Creating new branch...");

        try {
          await execAsync(`git checkout -b ${branchName}`);
          succeedSpinner(createSpinner, "Branch created successfully!");
          console.log(`\n✨ Successfully created and switched to branch: "${branchName}"`);
          console.log(`💡 You can now make your changes and use "git-axiom commit" when ready!`);
        } catch (branchError) {
          createSpinner.fail("Branch creation failed");
          throw new Error(`Git branch creation failed: ${branchError.message}`);
        }
      } else {
        console.log("\n❌ Branch creation cancelled.");
        console.log(`💡 Suggested branch name was: "${branchName}"`);
      }
    } catch (error) {
      if (spinner) {
        spinner.fail("Operation failed");
      }

      console.error("\n🚨 Error:", error.message);

      // Provide helpful suggestions based on error type
      if (error.message.includes("API key")) {
        console.log("\n💡 Please set your OpenAI API key:");
        console.log('   export OPENAI_API_KEY="your-api-key-here"');
      } else if (error.message.includes("not a git repository")) {
        console.log("\n💡 Make sure you are in a Git repository directory.");
      } else if (error.message.includes("already exists")) {
        console.log("\n💡 A branch with this name already exists. Try a different approach or rename manually.");
      }

      process.exit(1);
    }
  });

program
  .command("init")
  .description("Initialize Git Axiom in your Git repository")
  .action(() => {
    console.log("🚀 Initializing Git Axiom...");
    console.log("💡 Make sure to set your OpenAI API key:");
    console.log('   export OPENAI_API_KEY="your-api-key-here"');
    console.log(
      '\n✅ Git Axiom is ready! Use "git-axiom commit" to generate AI-powered commit messages.'
    );
  });

program
  .command("review")
  .description("Get AI-powered code review suggestions")
  .action(() => {
    console.log("🔍 Code review feature coming soon...");
    console.log('💡 For now, use "git-axiom commit" to generate commit messages.');
  });

program.parse(process.argv);
