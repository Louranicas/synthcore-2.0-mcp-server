#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const os = require('os');
const { execSync } = require('child_process');

console.log('Synthcore 2.0 MCP Server Installation');
console.log('====================================');

// Build the project
console.log('\nBuilding the project...');
try {
  execSync('npm run build', { stdio: 'inherit' });
  console.log('Build completed successfully.');
} catch (error) {
  console.error('Build failed:', error.message);
  process.exit(1);
}

// Determine the installation type
const args = process.argv.slice(2);
const installType = args[0] || 'local';

if (installType === 'local') {
  console.log('\nLocal installation completed.');
  console.log('To start the server, run: npm start');
  console.log('To install the server for VSCode, run: node install.js vscode');
  console.log('To install the server for Claude Desktop, run: node install.js claude');
} else if (installType === 'vscode') {
  // Install for VSCode
  console.log('\nInstalling for VSCode...');
  try {
    execSync('npm run install-vscode', { stdio: 'inherit' });
    console.log('VSCode installation completed successfully.');
  } catch (error) {
    console.error('VSCode installation failed:', error.message);
    process.exit(1);
  }
} else if (installType === 'claude') {
  // Install for Claude Desktop
  console.log('\nInstalling for Claude Desktop...');
  try {
    execSync('npm run install-claude', { stdio: 'inherit' });
    console.log('Claude Desktop installation completed successfully.');
  } catch (error) {
    console.error('Claude Desktop installation failed:', error.message);
    process.exit(1);
  }
} else {
  console.error(`Unknown installation type: ${installType}`);
  console.error('Valid options are: local, vscode, claude');
  process.exit(1);
}

console.log('\nInstallation completed.');
console.log('To use the server, restart your application (VSCode or Claude Desktop).');
console.log('You can then use the server with the name "synthcore".');
