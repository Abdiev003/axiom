# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [1.1.0] - 2024-12-20

### Added
- 🌟 **NEW: Smart Branch Naming** - AI-powered branch name generation
- 🤖 `git-axiom branch` command with multiple branch types
- 🎯 Support for feature, fix, hotfix, refactor, and docs branches
- 📝 Intelligent analysis of both staged and unstaged changes
- 🎨 Beautiful interactive prompts for branch creation
- 🔧 Comprehensive test suite for branch functionality
- 📋 Extended CLI help system with detailed usage examples

### Enhanced
- 🚀 AI utility now supports dual-purpose analysis (commits + branches)
- 💡 Smarter diff processing with better token management
- 🎨 Improved user interface with better error messages
- 📖 Updated documentation with new branch naming feature

### Commands
- `git-axiom branch` - Generate AI-powered branch names
- `git-axiom branch --type <type>` - Create specific branch types
- `git-axiom branch --help` - Show branch command help

### Technical Improvements
- 🔍 Enhanced Git integration with better change detection
- 🛡️ Robust error handling for branch creation scenarios
- ⚡ Optimized API calls with intelligent diff truncation
- 🧪 Comprehensive test coverage for new functionality

## [1.0.1] - 2024-01-15

### Fixed
- 🐛 Fixed error handling for network timeouts
- 🐛 Resolved API response parsing edge cases
- 🐛 Fixed CLI help text formatting

### Changed
- 📝 Improved commit message generation accuracy
- 🎨 Enhanced UI with better spinner animations
- ⚡ Optimized API request performance

### Security
- 🔒 Added input validation for git diff content
- 🔒 Improved API key handling security

## [1.0.0] - 2024-01-10

### Added
- 🎉 Initial release of Git Axiom
- ✨ AI-powered commit message generation using OpenAI GPT
- 🎯 Conventional Commits specification support
- 🎨 Interactive CLI interface with beautiful UI
- 🛡️ Comprehensive error handling with helpful suggestions
- 📝 Smart analysis of staged Git changes
- ⚡ Lightning-fast commit message generation
- 🔧 Easy setup with environment variable configuration
- 📋 Multiple CLI commands (`commit`, `init`, `review`)
- 🚀 Cross-platform support (Windows, macOS, Linux)

### Features
- **AI Integration**: Seamless OpenAI API integration
- **Git Operations**: Automatic staging and commit workflows  
- **User Experience**: Interactive prompts with confirmation steps
- **Error Recovery**: Detailed error messages with solutions
- **Performance**: Optimized for speed and minimal resource usage

### Commands
- `git-axiom commit` - Generate AI-powered commit messages
- `git-axiom init` - Initialize and check setup
- `git-axiom --help` - Show help information

### Dependencies
- `axios` ^1.10.0 - HTTP client for API requests
- `chalk` ^5.4.1 - Terminal string styling
- `commander` ^14.0.0 - CLI framework
- `dotenv` ^16.5.0 - Environment variable management
- `inquirer` ^12.6.3 - Interactive command line prompts
- `ora` ^8.2.0 - Loading spinners

---

## Version History Summary

- **v1.1.0**: Smart Branch Naming feature with AI-powered branch generation  
- **v1.0.1**: Bug fixes and performance improvements
- **v1.0.0**: Initial stable release with core functionality

## Migration Guide

### From v1.0.x to v1.1.0
No breaking changes. Simply update:
```bash
npm update -g git-axiom
```

New features available:
- Use `git-axiom branch` for AI-powered branch naming
- All existing commands work exactly the same

### From v1.0.0 to v1.0.1
No breaking changes. Simply update:
```bash
npm update -g git-axiom
```

## Planned Features

### v1.2.0 (Upcoming)
- 🔄 Bulk commit processing
- 📊 Commit statistics and analytics  
- 🎨 Custom commit message templates
- 🔧 Configuration file support
- 🌐 Multi-language support

### v1.3.0 (Future)
- 🤖 Multiple AI model support (Claude, Gemini)
- 📱 Web interface
- 🔗 Git hooks integration
- 📈 Team collaboration features

## Breaking Changes

None yet! We're committed to backward compatibility.

## Contributors

Special thanks to all contributors:
- [@Abdiev003](https://github.com/Abdiev003) - Creator and maintainer

## Support

For questions about changes or migrations:
- 📧 Email: aliabdiyev000@gmail.com
- 🐛 [Report Issues](https://github.com/Abdiev003/git-axiom/issues)
- 💬 [Discussions](https://github.com/Abdiev003/git-axiom/discussions)

---

**Legend:**
- 🎉 Major Features
- ✨ New Features  
- 🐛 Bug Fixes
- 📝 Documentation
- 🎨 UI/UX Improvements
- ⚡ Performance
- 🔒 Security
- 🔧 Configuration
- 📊 Analytics
- 🔄 Workflow 