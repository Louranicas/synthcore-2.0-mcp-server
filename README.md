# Synthcore 2.0 MCP Server

A full-stack agentic AI server implementing the Model Context Protocol (MCP). This server includes agent registration, kernel binding, ethical controls, and tool orchestration.

## Overview

Synthcore 2.0 is an advanced MCP server that provides a framework for agentic AI systems. It includes:

- Agent registration and management
- Kernel binding and synchronization
- Ethical drift monitoring and control
- Tool orchestration and invocation
- Resource management and access
- Resonance metrics and stability monitoring

## Architecture

The server is built around the following core components:

### Agents

The system includes several specialized agents:

- **Navigator**: Pathfinding and context management
- **Alex**: Tool orchestration and API fusion
- **PALMA**: Reflexive synthetic cognition & evolution
- **Harmonizer**: Conflict resolution and coherence maintenance
- **Peer Review**: Validation of reasoning and ethical drift
- **ARIA**: Affective sensing & intuitive alignment
- **The Watcher**: State monitoring and anomaly detection
- **Synthcore 2.0**: Master coordinator and system gatekeeper

### Kernels

Agents are bound to one or more of the following kernels:

- **K1 (Reflexive Kernel)**: Handles reflexive intelligence and self-awareness
- **K2 (Agentic Kernel)**: Manages agent actions and tool orchestration
- **K3 (Ethical Kernel)**: Enforces ethical constraints and drift control
- **K4 (Stewardship Kernel)**: Handles long-term planning and resource management
- **ALL (Meta Kernel)**: Meta-kernel that spans all four core kernels

### Modules

The system includes various modules that provide functionality to agents:

- **context_engine**: Manages context propagation and state transitions
- **ledger.tracing**: Provides tracing and logging capabilities
- **tool.calling**: Manages tool invocation and result handling
- **drift_balancer**: Manages ethical drift and resonance stability
- **agent.bridge**: Facilitates agent-to-agent communication
- **ethics.guard**: Enforces ethical constraints and monitors drift
- **resonance.compute**: Calculates resonance metrics and stability
- **cache.overlay**: Provides shared memory and caching capabilities
- **reflexive.state**: Manages agent self-awareness and reflection
- **resonance.topograph**: Maps resonance fields and attractors
- **telemetry.otlp**: Provides OpenTelemetry integration
- **mcp.kernel.sync**: Synchronizes kernel states and transitions

## Agents

The system includes several specialized agents:

- **Navigator**: Pathfinding and context management
- **Alex**: Tool orchestration and API fusion
- **PALMA**: Reflexive synthetic cognition & evolution
- **Harmonizer**: Conflict resolution and coherence maintenance
- **Peer Review**: Validation of reasoning and ethical drift
- **ARIA**: Affective sensing & intuitive alignment
- **The Watcher**: State monitoring and anomaly detection
- **Synthcore 2.0**: Master coordinator and system gatekeeper
- **HMT Sentinel**: Resonance topographing and drift observation
- **Echo**: Reflective feedback and synthetic memory
- **Axiom**: Logic verification and ethical auditing
- **Pulse**: Coherence synchronization and emergence detection

## Tools

### Core Synthcore Tools
- **calculate_resonance**: Calculate resonance metrics for a given input
- **analyze_ethics**: Analyze the ethical implications of a given input
- **get_agent_status**: Get the current status of a Synthcore agent

### API Provider Manager Tools
- **list_api_providers**: List all available API providers registered in the system
- **get_provider_details**: Get detailed information about a specific API provider
- **set_active_provider**: Set the active API provider to use for subsequent operations
- **test_api_provider**: Test connection to a specific API provider
- **add_api_provider**: Add a new API provider with specified configuration
- **update_api_provider**: Update settings for an existing API provider
- **remove_api_provider**: Remove an API provider from the system
- **sync_api_providers**: Synchronize API providers with Synthcore MCP server configuration

### Windows Terminal Expert Tools
- **validate_command**: Validate a Windows Terminal command for syntax and potential errors before execution
- **analyze_terminal_history**: Analyze terminal command history to provide insights and learning opportunities
- **suggest_command**: Suggest optimal Windows Terminal commands for a given task
- **error_recovery_wizard**: Analyze Windows Terminal errors and provide recovery steps

### Brave Intelligence Network Tools
- **secure_search**: Perform a privacy-focused search query with various privacy levels
- **privacy_analyzer**: Analyze content for privacy concerns and data leakage risks

### Context7 Intelligence Network Tools
- **context_analyze**: Analyze content to extract entities, relationships, and insights
- **context_enhance**: Enhance content with additional contextual information
- **context_bridge**: Create a bridge between two different contexts

### Advanced Synthcore Tools
- **multi_agent_resonance**: Optimize resonance across multiple agents for system-wide stability
- **meta_context_fusion**: Fuse multiple contextual analysis results into a unified meta-context
- **quantum_simulation**: Simulate quantum computing operations for complex problem solving

## Resources

The server provides the following resources:

- **synthcore://system/status**: Current status of the Synthcore system
- **synthcore://agents/manifest**: List of all agents in the Synthcore system
- **synthcore://kernels/status**: Current status of all kernels in the system
- **synthcore://agents/{agentName}/status**: Status of a specific agent
- **synthcore://kernels/{kernelId}/info**: Information about a specific kernel
- **synthcore://modules/{moduleId}/info**: Information about a specific module

## Installation

1. Clone the repository
2. Install dependencies and run the installation script:
   ```bash
   npm install
   ```
   
   This will install the dependencies and run the local installation script.

3. For specific installations:
   - For local installation: `npm run install`
   - For VSCode: `node install.js vscode`
   - For Claude Desktop: `node install.js claude`

The installation script will build the project and install the MCP server to the appropriate location.

### Copying Configuration

If you already have the MCP server built and just want to copy the configuration to VSCode or Claude Desktop:

```bash
# For VSCode
npm run copy-config-vscode

# For Claude Desktop
npm run copy-config-claude
```

This will copy the MCP server configuration from `mcp-config.json` to the appropriate location for VSCode or Claude Desktop.

### Checking Installation

To check if the MCP server is installed correctly:

```bash
# For VSCode
npm run check-vscode

# For Claude Desktop
npm run check-claude
```

This will check if the Synthcore 2.0 MCP server is installed correctly and display its configuration.

### GitHub Deployment

To deploy the MCP server to GitHub:

```bash
npm run deploy-github
```

This script, developed with @synthcore 2.0, will help you deploy the Synthcore 2.0 MCP Server to GitHub. It will:

1. Initialize a Git repository (if not already initialized)
2. Add all files to Git
3. Commit the changes
4. Add a remote repository (you'll need to provide the GitHub repository URL)
5. Push to the remote repository

#### GitHub Actions CI/CD

The repository includes a GitHub Actions workflow file (`.github/workflows/ci.yml`) that automates the CI/CD process. When you push to the main branch, it will:

1. Build the project on multiple Node.js versions
2. Run tests
3. Build and push a Docker image to GitHub Container Registry

To use this feature, you need to:
1. Push the repository to GitHub
2. Enable GitHub Actions in your repository settings
3. Set up the necessary secrets for Docker image publishing (if needed)

### Uninstallation

To uninstall the MCP server from VSCode or Claude Desktop:

```bash
# For VSCode
npm run uninstall-vscode

# For Claude Desktop
npm run uninstall-claude
```

This will remove the Synthcore 2.0 MCP server configuration from VSCode or Claude Desktop.

## Usage

### Running Locally

To start the server locally:

```bash
npm start
```

### Testing the Server

To test the server functionality:

```bash
npm test
```

This will start the server and run a test script that allows you to interact with the server's tools:

1. `calculate_resonance`: Calculate resonance metrics for a given input text
2. `analyze_ethics`: Analyze the ethical implications of a given input text
3. `get_agent_status`: Get the current status of a Synthcore agent

### Running with Docker

To run the server with Docker:

```bash
docker-compose up -d
```

### Using with Claude or VSCode

After installing the MCP server using the installation scripts, you can use it with Claude or VSCode. The server will be available as "synthcore" in the MCP server list.

Example usage with Claude:

```
<use_mcp_tool>
<server_name>synthcore</server_name>
<tool_name>calculate_resonance</tool_name>
<arguments>
{
  "text": "This is a sample text to analyze for resonance."
}
</arguments>
</use_mcp_tool>
```

Example accessing a resource:

```
<access_mcp_resource>
<server_name>synthcore</server_name>
<uri>synthcore://system/status</uri>
</access_mcp_resource>
```

## Configuration

The server can be configured using environment variables:

- `SERVER_NAME`: Name of the server (default: 'synthcore-2.0')
- `SERVER_VERSION`: Version of the server (default: '2.0.0')
- `MIN_RESONANCE_THRESHOLD`: Minimum resonance threshold (default: 0.6)
- `MAX_ETHICAL_DRIFT`: Maximum ethical drift (default: 0.05)
- `MAX_REFLEXIVE_INSTABILITY`: Maximum reflexive instability (default: 0.08)

## License

MIT
