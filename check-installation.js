#!/usr/bin/env node
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';
import { fileURLToPath } from 'url';

// Get the current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('Synthcore 2.0 MCP Server Installation Check');
console.log('=========================================');

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
  console.log('Synthcore 2.0 MCP server is NOT installed.');
  console.log(`\nTo install, run: npm run install-${target === 'vscode' ? 'vscode' : 'claude'}`);
  process.exit(0);
}

// Check if the server is disabled
const isDisabled = config.mcpServers.synthcore.disabled === true;

console.log('Synthcore 2.0 MCP server is installed.');
console.log(`Status: ${isDisabled ? 'Disabled' : 'Enabled'}`);
console.log('\nConfiguration:');
console.log(JSON.stringify(config.mcpServers.synthcore, null, 2));

// Check if the server executable exists
const serverPath = config.mcpServers.synthcore.args[0];
const fullServerPath = path.resolve(__dirname, serverPath);

if (!fs.existsSync(fullServerPath)) {
  console.log(`\nWARNING: Server executable not found at: ${fullServerPath}`);
  console.log('You may need to build the project first: npm run build');
} else {
  console.log(`\nServer executable found at: ${fullServerPath}`);
}

console.log('\nInstallation check completed.');
