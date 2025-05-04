#!/usr/bin/env node
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

// Get the current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Get the absolute path to the build directory
const buildDir = path.resolve(__dirname, 'build');

// Determine the MCP settings file path based on the platform
let mcpSettingsPath;
if (process.argv.includes('--vscode')) {
  // VSCode MCP settings
  mcpSettingsPath = path.join(os.homedir(), 'AppData', 'Roaming', 'Code', 'User', 'globalStorage', 'saoudrizwan.claude-dev', 'settings', 'cline_mcp_settings.json');
} else if (process.argv.includes('--claude-desktop')) {
  // Claude desktop app settings
  if (process.platform === 'win32') {
    mcpSettingsPath = path.join(os.homedir(), 'AppData', 'Roaming', 'Claude', 'claude_desktop_config.json');
  } else if (process.platform === 'darwin') {
    mcpSettingsPath = path.join(os.homedir(), 'Library', 'Application Support', 'Claude', 'claude_desktop_config.json');
  } else {
    mcpSettingsPath = path.join(os.homedir(), '.config', 'Claude', 'claude_desktop_config.json');
  }
} else {
  console.error('Please specify either --vscode or --claude-desktop');
  process.exit(1);
}

// Check if the build directory exists
if (!fs.existsSync(buildDir)) {
  console.error('Build directory not found. Please run "npm run build" first.');
  process.exit(1);
}

// Check if the MCP settings file exists
if (!fs.existsSync(mcpSettingsPath)) {
  console.error(`MCP settings file not found at: ${mcpSettingsPath}`);
  console.error('Please make sure you have the correct application installed.');
  process.exit(1);
}

// Read the current MCP settings
let mcpSettings;
try {
  mcpSettings = JSON.parse(fs.readFileSync(mcpSettingsPath, 'utf8'));
} catch (error) {
  console.error(`Error reading MCP settings file: ${error.message}`);
  process.exit(1);
}

// Initialize mcpServers if it doesn't exist
if (!mcpSettings.mcpServers) {
  mcpSettings.mcpServers = {};
}

// Add or update the Synthcore MCP server
mcpSettings.mcpServers.synthcore = {
  command: 'node',
  args: [path.join(buildDir, 'synthcore-server', 'index.js')],
  env: {
    SERVER_NAME: 'synthcore-2.0',
    SERVER_VERSION: '2.0.0',
    MIN_RESONANCE_THRESHOLD: '0.6',
    MAX_ETHICAL_DRIFT: '0.05',
    MAX_REFLEXIVE_INSTABILITY: '0.08'
  },
  disabled: false,
  autoApprove: []
};

// Write the updated MCP settings
try {
  fs.writeFileSync(mcpSettingsPath, JSON.stringify(mcpSettings, null, 2));
  console.log(`Successfully installed Synthcore 2.0 MCP server to: ${mcpSettingsPath}`);
} catch (error) {
  console.error(`Error writing MCP settings file: ${error.message}`);
  process.exit(1);
}

console.log('Installation complete. Please restart your application to use the Synthcore 2.0 MCP server.');
