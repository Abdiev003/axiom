# 🚀 Git Axiom

> An AI-powered CLI tool to supercharge your Git workflows with intelligent commit messages

[![npm version](https://badge.fury.io/js/git-axiom.svg)](https://badge.fury.io/js/git-axiom)
[![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg)](https://opensource.org/licenses/ISC)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D14.0.0-brightgreen)](https://nodejs.org/)

## ✨ Features

- 🤖 **AI-Powered Commit Messages** - Generate professional, conventional commit messages using OpenAI GPT
- ⚡ **Lightning Fast** - Analyze staged changes and generate commit messages in seconds  
- 🎯 **Conventional Commits** - Follows industry-standard commit message format automatically
- 🎨 **Beautiful UI** - Interactive prompts with colored output and loading spinners
- 🛡️ **Error Handling** - Comprehensive error handling with helpful suggestions
- 📝 **Smart Analysis** - Analyzes your code changes to create contextually relevant messages

## 🔧 Installation

### Prerequisites
- Node.js 14.0.0 or higher
- Git repository
- OpenAI API key

### Install via npm
```bash
npm install -g git-axiom
```

### Local Development Setup
```bash
# Clone the repository
git clone https://github.com/Abdiev003/git-axiom.git
cd git-axiom

# Install dependencies
npm install

# Make executable
chmod +x index.js

# Link for global usage (optional)
npm link
```

## 🔑 Setup

### 1. Get OpenAI API Key
1. Visit [OpenAI Platform](https://platform.openai.com/api-keys)
2. Create a new API key
3. Copy your API key

### 2. Set Environment Variable
```bash
# Add to your shell profile (.bashrc, .zshrc, etc.)
export OPENAI_API_KEY="your-openai-api-key-here"

# Or set for current session
export OPENAI_API_KEY="sk-..."
```

### 3. Initialize Git Axiom
```bash
git-axiom init
```

## 🚀 Usage

### Basic Workflow

1. **Stage your changes**
```bash
git add .
# or
git add specific-file.js
```

2. **Generate AI commit message**
```bash
git-axiom commit
```

3. **Review and confirm**
The tool will:
- Analyze your staged changes
- Generate a professional commit message
- Show you the message for approval
- Commit automatically if you approve

### Example Session
```bash
$ git add src/auth.js
$ git-axiom commit

⠋ Analyzing staged files...
⠋ Generating commit message with AI...
✅ Commit message generated!

📝 Generated commit message:
"feat(auth): add user authentication middleware"

? Do you want to proceed with this commit message? (Y/n) 

⠋ Committing changes...
✅ Commit successful!

✨ Successfully committed with message: "feat(auth): add user authentication middleware"
```

## 📋 Commands

### `git-axiom commit`
Generate AI-powered commit messages for staged changes.

```bash
git-axiom commit
```

**What it does:**
1. Analyzes your staged Git changes
2. Sends the diff to OpenAI for analysis
3. Generates a conventional commit message
4. Asks for your confirmation
5. Commits the changes if approved

### `git-axiom init`
Initialize Git Axiom and check setup.

```bash
git-axiom init
```

### `git-axiom --help`
Show help information and available commands.

```bash
git-axiom --help
# or
git-axiom -h
```

## 🎯 Conventional Commits

Axiom automatically generates commit messages following the [Conventional Commits](https://www.conventionalcommits.org/) specification:

```
<type>(<scope>): <subject>
```

### Common Types:
- `feat`: New features
- `fix`: Bug fixes
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

### Examples:
```bash
feat(auth): add OAuth2 authentication
fix(api): resolve user data validation error
docs(readme): update installation instructions
refactor(utils): simplify helper functions
```

## 🛠️ Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `OPENAI_API_KEY` | Your OpenAI API key (required) | - |
| `AI_MODEL` | OpenAI model to use | `gpt-3.5-turbo` |
| `AI_BASE_URL` | Custom API endpoint | `https://api.openai.com/v1` |

### Custom Configuration Example
```bash
export OPENAI_API_KEY="sk-..."
```

## 🐛 Troubleshooting

### Common Issues

**"No staged changes found"**
```bash
# Solution: Stage your changes first
git add .
```

**"OpenAI API key not found"**
```bash
# Solution: Set your API key
export OPENAI_API_KEY="your-key-here"
```

**"Not a git repository"**
```bash
# Solution: Make sure you're in a Git repository
git init
```

**"Rate limit exceeded"**
```bash
# Solution: Wait a moment and try again
# Or upgrade your OpenAI plan
```

## 🏗️ Architecture

```
axiom/
├── index.js              # Main CLI entry point
├── utils/
│   ├── git.js           # Git operations
│   ├── ai.js            # OpenAI API integration
│   └── ui.js            # User interface helpers
├── package.json
└── README.md
```

### Key Components:
- **Commander.js** - CLI framework
- **Axios** - HTTP client for API calls
- **Inquirer** - Interactive prompts
- **Ora** - Loading spinners
- **Chalk** - Terminal colors

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Add tests if applicable
5. Commit using Git Axiom (`git-axiom commit` 😉)
6. Push to your branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

### Development Setup
```bash
git clone https://github.com/Abdiev003/git-axiom.git
cd git-axiom
npm install
npm link  # For global testing
```

## 📄 License

This project is licensed under the ISC License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [OpenAI](https://openai.com/) for providing the GPT API
- [Conventional Commits](https://www.conventionalcommits.org/) for the commit format specification
- The open-source community for the amazing tools and libraries

## 📞 Support

- 🐛 [Report Issues](https://github.com/Abdiev003/git-axiom/issues)
- 💬 [Discussions](https://github.com/Abdiev003/git-axiom/discussions)
- 📧 Email: aliabdiyev000@gmail.com

---

<div align="center">
  <b>⭐ Star this repository if Axiom helps improve your Git workflow! ⭐</b>
</div>

---

**Made with ❤️ by Ali Abdiyev(https://github.com/Abdiev003)** 