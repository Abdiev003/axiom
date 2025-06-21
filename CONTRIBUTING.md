# Contributing to Git Axiom

🎉 First off, thanks for taking the time to contribute! 🎉

The following is a set of guidelines for contributing to Git Axiom. These are mostly guidelines, not rules. Use your best judgment, and feel free to propose changes to this document in a pull request.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [How Can I Contribute?](#how-can-i-contribute)
- [Development Setup](#development-setup)
- [Pull Request Process](#pull-request-process)
- [Style Guides](#style-guides)

## Code of Conduct

This project and everyone participating in it is governed by our commitment to providing a welcoming and inclusive environment for all contributors.

## How Can I Contribute?

### 🐛 Reporting Bugs

Before creating bug reports, please check existing issues as you might find out that you don't need to create one. When you are creating a bug report, please include as many details as possible:

- **Use a clear and descriptive title**
- **Describe the exact steps to reproduce the problem**
- **Provide specific examples to demonstrate the steps**
- **Describe the behavior you observed after following the steps**
- **Explain which behavior you expected to see instead and why**
- **Include details about your configuration and environment**

### 💡 Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion, please include:

- **Use a clear and descriptive title**
- **Provide a step-by-step description of the suggested enhancement**
- **Provide specific examples to demonstrate the steps**
- **Describe the current behavior and explain which behavior you expected to see instead**
- **Explain why this enhancement would be useful**

### 🔧 Pull Requests

- Fill in the required template
- Do not include issue numbers in the PR title
- Include screenshots and animated GIFs in your pull request whenever possible
- Follow the JavaScript style guide
- Include thoughtfully-worded, well-structured tests
- Document new code
- End all files with a newline

## Development Setup

### Prerequisites

- Node.js 14.0.0 or higher
- npm or yarn
- Git

### Local Development

1. **Fork the repository**
   ```bash
   # Click the Fork button on GitHub, then clone your fork
   git clone https://github.com/YOUR_USERNAME/git-axiom.git
   cd git-axiom
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   # Create a .env file for testing (don't commit this)
   echo "OPENAI_API_KEY=your-test-api-key" > .env
   ```

4. **Make the CLI executable**
   ```bash
   chmod +x index.js
   npm link  # This makes git-axiom available globally for testing
   ```

5. **Run tests**
   ```bash
   npm test              # Run all tests
   npm run test:watch    # Run tests in watch mode
   npm run test:coverage # Run tests with coverage report
   ```

6. **Run linting**
   ```bash
   npm run lint          # Check for linting errors
   npm run lint:fix      # Fix auto-fixable linting errors
   ```

### Project Structure

```
git-axiom/
├── index.js              # Main CLI entry point
├── utils/
│   ├── ai.js            # AI/OpenAI integration
│   ├── git.js           # Git operations
│   ├── ui.js            # User interface helpers
│   └── trial.js         # Trial functionality
├── tests/               # Test files
│   ├── ai.test.js
│   └── git.test.js
├── .github/
│   └── workflows/       # GitHub Actions
└── README.md
```

## Pull Request Process

1. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```

2. **Make your changes**
   - Write clean, readable code
   - Add tests for new functionality
   - Update documentation as needed

3. **Test your changes**
   ```bash
   npm test
   npm run lint
   ```

4. **Commit using conventional commits**
   ```bash
   # Use git-axiom itself!
   git add .
   git-axiom commit
   ```

5. **Push and create a pull request**
   ```bash
   git push origin feature/amazing-feature
   ```

6. **Pull Request Requirements**
   - Update the README.md with details of changes if applicable
   - Update the version following semantic versioning
   - The PR will be merged once you have the sign-off of at least one maintainer

## Style Guides

### Git Commit Messages

We use conventional commits format. Examples:
- `feat(cli): add new command for bulk commits`
- `fix(ai): resolve API timeout issues`
- `docs(readme): update installation instructions`
- `test(git): add tests for getStagedDiff function`

### JavaScript Style Guide

We use ESLint with the Standard configuration. Key points:

- Use ES6+ features
- Use single quotes for strings
- No semicolons (except where required)
- Use camelCase for variables and functions
- Use PascalCase for classes
- Add JSDoc comments for functions
- Prefer const over let, never use var

### Testing

- Write tests for all new functionality
- Use descriptive test names
- Group related tests in describe blocks
- Mock external dependencies
- Aim for high test coverage

## Questions?

Don't hesitate to reach out if you have questions:

- Create an issue for bugs or feature requests
- Email: aliabdiyev000@gmail.com
- GitHub: [@Abdiev003](https://github.com/Abdiev003)

Thank you for contributing! 🚀 