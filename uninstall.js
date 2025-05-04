#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const os = require('os');

console.log('Synthcore 2.0 MCP Server Uninstallation');
console.log('======================================');

// Determine the target location
const args = process.argv.slice(2);
const target = args[0] || 'vscode';

// Determine the target configuration file path
let configPath;
if (target === 'vscode') {
  configPath = path.join(os.homedir(), 'AppData', 'Roaming', 'Code', 'User', 'globalStorage', 'saoudrizwan.claude-dev', 'settings', 'cline_mcp_settings.json');
} else if (target === 'claude') {
  if (process.platform === 'win32') {
    configPath = path.join(os.homedir(), 'AppData', 'Roaming', 'Claude', 'claude_desktop_config.json');
  } else if (process.platform === 'darwin') {
    configPath = path.join(os.homedir(), 'Library', 'Application Support', 'Claude', 'claude_desktop_config.json');
  } else {
    configPath = path.join(os.homedir(), '.config', 'Claude', 'claude_desktop_config.json');
  }
} else {
  console.error(`Unknown target: ${target}`);
  console.error('Valid targets are: vscode, claude');
  process.exit(1);
}

// Check if the configuration file exists
if (!fs.existsSync(configPath)) {
  console.error(`Configuration file not found at: ${configPath}`);
  console.error('Please make sure you have the correct application installed.');
  process.exit(1);
}

// Read the configuration
let config;
try {
  config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
} catch (error) {
  console.error(`Error reading configuration file: ${error.message}`);
  process.exit(1);
}

// Check if the Synthcore MCP server is installed
if (!config.mcpServers || !config.mcpServers.synthcore) {
  console.error('Synthcore 2.0 MCP server is not installed.');
  process.exit(1);
}

// Remove the Synthcore MCP server
delete config.mcpServers.synthcore;

// Write the updated configuration
try {
  fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
  console.log(`Successfully uninstalled Synthcore 2.0 MCP server from: ${configPath}`);
} catch (error) {
  console.error(`Error writing configuration file: ${error.message}`);
  process.exit(1);
}

console.log('Uninstallation completed.');
console.log('Please restart your application to apply the changes.');
