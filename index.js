#!/usr/bin/env node

import { Command } from "commander";
import { createRequire } from "module";
import { getStagedDiff } from "./utils/git.js";
import { generateCommitMessage } from "./utils/ai.js";
import { startSpinner, succeedSpinner, confirmCommit } from "./utils/ui.js";
import { exec } from "child_process";
import { promisify } from "util";

const require = createRequire(import.meta.url);
const packageJson = require("./package.json");
const execAsync = promisify(exec);

const program = new Command();

program
  .name("axiom")
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
  .command("init")
  .description("Initialize Axiom in your Git repository")
  .action(() => {
    console.log("🚀 Initializing Axiom...");
    console.log("💡 Make sure to set your OpenAI API key:");
    console.log('   export OPENAI_API_KEY="your-api-key-here"');
    console.log(
      '\n✅ Axiom is ready! Use "axiom commit" to generate AI-powered commit messages.'
    );
  });

program
  .command("review")
  .description("Get AI-powered code review suggestions")
  .action(() => {
    console.log("🔍 Code review feature coming soon...");
    console.log('💡 For now, use "axiom commit" to generate commit messages.');
  });

program.parse(process.argv);
