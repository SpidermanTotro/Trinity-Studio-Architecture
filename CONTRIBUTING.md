# Contributing to Trinity Studio Architecture

Thank you for your interest in contributing to Trinity Studio Architecture! This document provides guidelines and information for contributors.

## 🌟 How to Contribute

### Reporting Bugs

1. **Check Existing Issues**: Search the [issue tracker](https://github.com/SpidermanTotro/Trinity-Studio-Architecture/issues) first
2. **Create Detailed Reports**: Include:
   - Clear description of the bug
   - Steps to reproduce
   - Expected vs actual behavior
   - System information (OS, Node version, etc.)
   - Relevant logs or screenshots

### Suggesting Features

1. **Check Roadmap**: Review our [roadmap](README.md#roadmap) first
2. **Open Discussion**: Start with [GitHub Discussions](https://github.com/SpidermanTotro/Trinity-Studio-Architecture/discussions)
3. **Create Feature Request**: Use the feature request template

### Submitting Code

1. **Fork the Repository**
   ```bash
   git clone https://github.com/YOUR_USERNAME/Trinity-Studio-Architecture.git
   cd Trinity-Studio-Architecture
   ```

2. **Create Feature Branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **Make Your Changes**
   - Follow coding standards
   - Write tests
   - Update documentation
   - Keep commits atomic and descriptive

4. **Test Your Changes**
   ```bash
   npm test
   npm run lint
   ```

5. **Commit with Conventional Commits**
   ```bash
   git commit -m "feat: add new expansion module"
   git commit -m "fix: resolve NPC pathfinding issue"
   git commit -m "docs: update installation guide"
   ```

6. **Push and Create PR**
   ```bash
   git push origin feature/your-feature-name
   ```

## 📋 Development Guidelines

### Code Style

- **JavaScript**: Follow ESLint configuration
- **Naming**: Use camelCase for variables/functions, PascalCase for classes
- **Comments**: Write clear, concise comments for complex logic
- **File Structure**: Organize by feature/module

### Testing Requirements

- **Unit Tests**: Required for new features
- **Integration Tests**: Required for module interactions
- **Coverage**: Aim for 80%+ coverage
- **Test Naming**: Descriptive test names (`should return error when NPC not found`)

### Documentation

- **Code Comments**: Document complex algorithms
- **API Documentation**: Update API docs for new endpoints
- **README Updates**: Keep README synchronized
- **Changelog**: Update CHANGELOG.md

### Commit Messages

Follow [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation changes
- `style:` Code style changes (formatting)
- `refactor:` Code refactoring
- `test:` Adding/updating tests
- `chore:` Maintenance tasks

### Pull Request Process

1. **PR Title**: Use conventional commit format
2. **Description**: Clearly explain changes and motivation
3. **Linked Issues**: Reference related issues
4. **Checklist**: Complete the PR template checklist
5. **Review**: Address reviewer feedback promptly
6. **CI/CD**: Ensure all checks pass

## 🏗️ Project Structure

Understanding the codebase:

```
src/
├── core/              # Core system components
│   ├── config/        # Configuration management
│   ├── database/      # Database abstraction
│   └── modules/       # Module loader
├── expansions/        # Expansion modules
│   └── [expansion]/   # Individual expansion code
├── ai-debugger/       # AI debugging system
├── data-extraction/   # Data extraction tools
├── live-programming/  # Hot-reload system
├── sync/              # Offline/online sync
└── player-experience/ # Player features
```

## 🔍 Code Review Criteria

Reviewers will check:

- ✅ Code quality and readability
- ✅ Test coverage
- ✅ Documentation completeness
- ✅ Performance impact
- ✅ Security considerations
- ✅ Backward compatibility

## 🚀 Development Setup

### Prerequisites

- Node.js >= 18.x
- MySQL/MariaDB >= 10.6
- Git

### Setup Steps

```bash
# Install dependencies
npm install

# Copy configuration
cp config/default.example.json config/default.json

# Initialize database
npm run db:init

# Run tests
npm test

# Start development server
npm run dev
```

## 📚 Resources

- **Architecture Docs**: [docs/architecture/](docs/architecture/)
- **API Reference**: [docs/api/](docs/api/)
- **Development Guide**: [docs/guides/development.md](docs/guides/development.md)
- **TrinityCore Wiki**: https://trinitycore.info/

## 🤝 Community

- **Discord**: [Join our Discord](#)
- **Forums**: [Community Forums](#)
- **Twitter**: [@TrinityStudio](#)

## 📝 License

By contributing, you agree that your contributions will be licensed under the MIT License.

## ❓ Questions?

Feel free to:
- Open a discussion
- Ask in Discord
- Email: contributors@trinity-studio.example.com

Thank you for contributing! 🎉
