# Security Policy

## Supported Versions

We actively support the following versions of Git Axiom with security updates:

| Version | Supported          |
| ------- | ------------------ |
| 1.x.x   | :white_check_mark: |
| < 1.0   | :x:                |

## Reporting a Vulnerability

We take security seriously at Git Axiom. If you discover a security vulnerability, please follow these steps:

### 🔒 Private Disclosure

**Please do NOT report security vulnerabilities through public GitHub issues.**

Instead, please report security vulnerabilities by email to:
- **Email**: aliabdiyev000@gmail.com
- **Subject**: [SECURITY] Git Axiom Security Vulnerability

### 📋 What to Include

When reporting a vulnerability, please include:

1. **Description** - A clear description of the vulnerability
2. **Impact** - What an attacker could achieve by exploiting this vulnerability
3. **Reproduction** - Steps to reproduce the vulnerability
4. **Affected Versions** - Which versions of Git Axiom are affected
5. **Suggested Fix** - If you have ideas on how to fix it (optional)

### ⏱️ Response Timeline

- **Acknowledgment**: We will acknowledge receipt of your vulnerability report within 48 hours
- **Initial Assessment**: We will provide an initial assessment within 72 hours
- **Status Updates**: We will send status updates every 5 business days until resolution
- **Resolution**: We aim to resolve critical vulnerabilities within 7 days

### 🛡️ Security Measures

Git Axiom implements several security measures:

- **API Key Security**: OpenAI API keys are only read from environment variables
- **Input Validation**: All user inputs are validated and sanitized
- **Dependency Scanning**: Regular dependency updates and vulnerability scanning
- **Code Analysis**: Automated code security analysis via CodeQL
- **Minimal Permissions**: The CLI requests only necessary system permissions

### 🔐 Security Best Practices for Users

When using Git Axiom:

1. **API Key Management**
   - Store your OpenAI API key securely in environment variables
   - Never commit API keys to version control
   - Rotate API keys regularly

2. **Repository Security**
   - Only run Git Axiom in trusted repositories
   - Review generated commit messages before confirming
   - Be aware of sensitive information in your code changes

3. **Network Security**
   - Ensure you're using HTTPS when possible
   - Be cautious when using on public networks

### 🏆 Recognition

We appreciate security researchers who help keep Git Axiom secure. Contributors who report valid security vulnerabilities will be:

- Acknowledged in our security advisories (if desired)
- Listed in our README contributors section
- Invited to test future security improvements

### 📞 Contact

For any security-related questions or concerns:

- **Email**: aliabdiyev000@gmail.com
- **GitHub**: [@Abdiev003](https://github.com/Abdiev003)

---

Thank you for helping keep Git Axiom and our community safe! 🛡️ 