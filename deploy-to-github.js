#!/usr/bin/env node
import { execSync } from 'child_process';
import * as readline from 'readline';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

// Get the current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create readline interface
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('Synthcore 2.0 MCP Server GitHub Deployment');
console.log('=========================================');
console.log('\nThis script will help you deploy the Synthcore 2.0 MCP Server to GitHub.');
console.log('Working with @synthcore 2.0 to ensure proper deployment...');

// Check if git is installed
try {
  execSync('git --version', { stdio: 'ignore' });
} catch (error) {
  console.error('Git is not installed. Please install Git and try again.');
  process.exit(1);
}

// Check if the current directory is a git repository
const isGitRepo = fs.existsSync(path.join(process.cwd(), '.git'));

// Function to initialize git repository
function initGitRepo() {
  if (!isGitRepo) {
    console.log('\nInitializing Git repository...');
    try {
      execSync('git init', { stdio: 'inherit' });
      console.log('Git repository initialized.');
    } catch (error) {
      console.error(`Error initializing Git repository: ${error.message}`);
      process.exit(1);
    }
  } else {
    console.log('\nGit repository already initialized.');
  }
}

// Function to add all files to git
function addAllFiles() {
  console.log('\nAdding all files to Git...');
  try {
    execSync('git add .', { stdio: 'inherit' });
    console.log('All files added to Git.');
  } catch (error) {
    console.error(`Error adding files to Git: ${error.message}`);
    process.exit(1);
  }
}

// Function to commit changes
function commitChanges() {
  console.log('\nCommitting changes...');
  try {
    execSync('git commit -m "Initial commit of Synthcore 2.0 MCP Server"', { stdio: 'inherit' });
    console.log('Changes committed.');
  } catch (error) {
    console.error(`Error committing changes: ${error.message}`);
    process.exit(1);
  }
}

// Function to add remote repository
function addRemoteRepo(repoUrl) {
  console.log(`\nAdding remote repository: ${repoUrl}`);
  try {
    execSync(`git remote add origin ${repoUrl}`, { stdio: 'inherit' });
    console.log('Remote repository added.');
  } catch (error) {
    console.error(`Error adding remote repository: ${error.message}`);
    process.exit(1);
  }
}

// Function to push to remote repository
function pushToRemote() {
  console.log('\nPushing to remote repository...');
  try {
    execSync('git push -u origin main', { stdio: 'inherit' });
    console.log('Successfully pushed to remote repository.');
  } catch (error) {
    console.error(`Error pushing to remote repository: ${error.message}`);
    console.log('You may need to push manually:');
    console.log('  git push -u origin main');
    process.exit(1);
  }
}

// Main function
function main() {
  // Initialize git repository
  initGitRepo();

  // Ask for GitHub repository URL
  rl.question('\nEnter your GitHub repository URL (e.g., https://github.com/username/repo.git): ', (repoUrl) => {
    if (!repoUrl) {
      console.error('Repository URL is required.');
      rl.close();
      process.exit(1);
    }

    // Add all files to git
    addAllFiles();

    // Commit changes
    commitChanges();

    // Add remote repository
    addRemoteRepo(repoUrl);

    // Push to remote repository
    pushToRemote();

    console.log('\nDeployment completed successfully!');
    console.log(`Your Synthcore 2.0 MCP Server is now available at: ${repoUrl}`);
    console.log('\nNext steps:');
    console.log('1. Clone the repository on your target machine');
    console.log('2. Run `npm install` to install dependencies');
    console.log('3. Run `npm start` to start the server');
    console.log('4. Use the server with Claude or VSCode');

    rl.close();
  });
}

// Run the main function
main();
