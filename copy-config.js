#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const os = require('os');

console.log('Synthcore 2.0 MCP Server Configuration Copy');
console.log('==========================================');

// Determine the target location
const args = process.argv.slice(2);
const target = args[0] || 'vscode';

// Source configuration file
const sourceConfigPath = path.resolve(__dirname, 'mcp-config.json');

// Check if the source configuration file exists
if (!fs.existsSync(sourceConfigPath)) {
  console.error(`Source configuration file not found at: ${sourceConfigPath}`);
  process.exit(1);
}

// Read the source configuration
let sourceConfig;
try {
  sourceConfig = JSON.parse(fs.readFileSync(sourceConfigPath, 'utf8'));
} catch (error) {
  console.error(`Error reading source configuration file: ${error.message}`);
  process.exit(1);
}

// Determine the target configuration file path
let targetConfigPath;
if (target === 'vscode') {
  targetConfigPath = path.join(os.homedir(), 'AppData', 'Roaming', 'Code', 'User', 'globalStorage', 'saoudrizwan.claude-dev', 'settings', 'cline_mcp_settings.json');
} else if (target === 'claude') {
  if (process.platform === 'win32') {
    targetConfigPath = path.join(os.homedir(), 'AppData', 'Roaming', 'Claude', 'claude_desktop_config.json');
  } else if (process.platform === 'darwin') {
    targetConfigPath = path.join(os.homedir(), 'Library', 'Application Support', 'Claude', 'claude_desktop_config.json');
  } else {
    targetConfigPath = path.join(os.homedir(), '.config', 'Claude', 'claude_desktop_config.json');
  }
} else {
  console.error(`Unknown target: ${target}`);
  console.error('Valid targets are: vscode, claude');
  process.exit(1);
}

// Check if the target configuration file exists
if (!fs.existsSync(targetConfigPath)) {
  console.error(`Target configuration file not found at: ${targetConfigPath}`);
  console.error('Please make sure you have the correct application installed.');
  process.exit(1);
}

// Read the target configuration
let targetConfig;
try {
  targetConfig = JSON.parse(fs.readFileSync(targetConfigPath, 'utf8'));
} catch (error) {
  console.error(`Error reading target configuration file: ${error.message}`);
  process.exit(1);
}

// Initialize mcpServers if it doesn't exist
if (!targetConfig.mcpServers) {
  targetConfig.mcpServers = {};
}

// Copy the Synthcore MCP server configuration
targetConfig.mcpServers = {
  ...targetConfig.mcpServers,
  ...sourceConfig.mcpServers
};

// Write the updated target configuration
try {
  fs.writeFileSync(targetConfigPath, JSON.stringify(targetConfig, null, 2));
  console.log(`Successfully copied Synthcore 2.0 MCP server configuration to: ${targetConfigPath}`);
} catch (error) {
  console.error(`Error writing target configuration file: ${error.message}`);
  process.exit(1);
}

console.log('Configuration copy completed.');
console.log('Please restart your application to use the Synthcore 2.0 MCP server.');
