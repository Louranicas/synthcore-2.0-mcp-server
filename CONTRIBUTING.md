# Contributing to Synthcore 2.0 MCP Server

Thank you for considering contributing to the Synthcore 2.0 MCP Server! This document provides guidelines and instructions for contributing to this project.

## Code of Conduct

By participating in this project, you agree to abide by our Code of Conduct. Please be respectful and considerate of others.

## How to Contribute

### Reporting Bugs

If you find a bug, please create an issue on GitHub with the following information:

- A clear, descriptive title
- A detailed description of the bug
- Steps to reproduce the bug
- Expected behavior
- Actual behavior
- Screenshots (if applicable)
- Environment information (OS, Node.js version, etc.)

### Suggesting Enhancements

If you have an idea for an enhancement, please create an issue on GitHub with the following information:

- A clear, descriptive title
- A detailed description of the enhancement
- Any relevant examples or mockups
- Why this enhancement would be useful

### Pull Requests

1. Fork the repository
2. Create a new branch for your feature or bug fix
3. Make your changes
4. Run tests to ensure your changes don't break existing functionality
5. Submit a pull request

#### Pull Request Guidelines

- Follow the existing code style
- Include tests for new features or bug fixes
- Update documentation as needed
- Keep pull requests focused on a single topic
- Reference any related issues in your pull request

## Development Setup

1. Clone the repository
2. Install dependencies: `npm install`
3. Build the project: `npm run build`
4. Run tests: `npm test`

## Project Structure

- `src/synthcore-server/`: Main server code
  - `agents/`: Agent definitions and registry
  - `kernels/`: Kernel definitions and manager
  - `modules/`: Module definitions and loader
  - `tools/`: Tool definitions and registry
  - `resources/`: Resource definitions and registry
  - `types.ts`: Type definitions
  - `index.ts`: Main entry point
- `test.js`: Test script
- `install.js`: Installation script
- `install-mcp-server.js`: MCP server installation script
- `copy-config.js`: Configuration copying script
- `uninstall.js`: Uninstallation script
- `check-installation.js`: Installation check script
- `deploy-to-github.js`: GitHub deployment script

## Coding Standards

- Use TypeScript for all new code
- Follow the existing code style
- Write clear, descriptive comments
- Use meaningful variable and function names
- Write tests for new functionality

## Testing

Run tests with `npm test`. Make sure all tests pass before submitting a pull request.

## Documentation

Update documentation as needed when making changes. This includes:

- README.md
- Code comments
- Any other relevant documentation

## License

By contributing to this project, you agree that your contributions will be licensed under the project's MIT license.
