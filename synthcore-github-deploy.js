#!/usr/bin/env node
/**
 * Synthcore 2.0 MCP Server GitHub Deployment Script
 * 
 * This script helps deploy the Synthcore 2.0 MCP Server to GitHub
 * with the assistance of the Synthcore 2.0 agent.
 */

import { execSync } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';
import * as readline from 'readline';
import { fileURLToPath } from 'url';

// Get the current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ANSI color codes for terminal output
const Colors = {
    BLUE: '\x1b[94m',
    CYAN: '\x1b[96m',
    GREEN: '\x1b[92m',
    YELLOW: '\x1b[93m',
    RED: '\x1b[91m',
    ENDC: '\x1b[0m',
    BOLD: '\x1b[1m'
};

// Create readline interface for user input
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

/**
 * Simulates the Synthcore 2.0 agent's response
 */
function synthcoreResponse(message) {
    console.log(`\n${Colors.CYAN}${Colors.BOLD}[Synthcore 2.0] ${message}${Colors.ENDC}`);
}

/**
 * Simulates the execution of a command by the Synthcore 2.0 agent
 */
function synthcoreExecute(command, description) {
    console.log(`\n${Colors.YELLOW}[Synthcore 2.0] ${description}${Colors.ENDC}`);
    console.log(`${Colors.BLUE}$ ${command}${Colors.ENDC}`);
    
    try {
        const output = execSync(command, { encoding: 'utf8' });
        if (output.trim()) {
            console.log(output);
        }
        return { success: true, output };
    } catch (error) {
        console.error(`${Colors.RED}Error: ${error.message}${Colors.ENDC}`);
        return { success: false, error };
    }
}

/**
 * Ask a question and get user input
 */
function askQuestion(question) {
    return new Promise((resolve) => {
        rl.question(`\n${Colors.YELLOW}${question}${Colors.ENDC}\n> `, (answer) => {
            resolve(answer.trim());
        });
    });
}

/**
 * Main deployment function
 */
async function deployToGitHub() {
    console.log(`\n${Colors.BOLD}=== Synthcore 2.0 MCP Server GitHub Deployment ===\n${Colors.ENDC}`);
    
    synthcoreResponse("Hello! I'm Synthcore 2.0, and I'll help you deploy this repository to GitHub.");
    synthcoreResponse("I'll guide you through each step of the process. Let's get started!");
    
    // Step 1: Check if Git is installed
    synthcoreResponse("First, I'll check if Git is installed on your system.");
    const gitCheck = synthcoreExecute('git --version', 'Checking Git installation');
    
    if (!gitCheck.success) {
        synthcoreResponse("Git doesn't appear to be installed. Please install Git and try again.");
        rl.close();
        return;
    }
    
    synthcoreResponse("Great! Git is installed.");
    
    // Step 2: Check if it's already a Git repository
    const isGitRepo = fs.existsSync(path.join(__dirname, '.git'));
    
    if (!isGitRepo) {
        synthcoreResponse("This directory is not a Git repository. I'll initialize it for you.");
        synthcoreExecute('git init', 'Initializing Git repository');
    } else {
        synthcoreResponse("This directory is already a Git repository.");
    }
    
    // Step 3: Configure Git user if needed
    synthcoreResponse("Let's make sure Git is configured with user information.");
    
    try {
        execSync('git config user.name', { encoding: 'utf8' });
        execSync('git config user.email', { encoding: 'utf8' });
        synthcoreResponse("Git user information is already configured.");
    } catch (error) {
        synthcoreResponse("Git user information is not configured. Let's set it up.");
        
        const name = await askQuestion("What name would you like to use for Git commits?");
        synthcoreExecute(`git config --global user.name "${name}"`, 'Setting Git user name');
        
        const email = await askQuestion("What email would you like to use for Git commits?");
        synthcoreExecute(`git config --global user.email "${email}"`, 'Setting Git user email');
    }
    
    // Step 4: Add all files to Git
    synthcoreResponse("Now I'll add all files to the Git repository.");
    synthcoreExecute('git add .', 'Adding all files to Git');
    
    // Step 5: Commit changes
    synthcoreResponse("Let's commit the changes with a descriptive message.");
    synthcoreExecute('git commit -m "Initial commit of Synthcore 2.0 MCP Server with 12 agents"', 'Committing changes');
    
    // Step 6: Get GitHub username
    const username = await askQuestion("What is your GitHub username?");
    
    // Step 7: Create GitHub repository
    synthcoreResponse(`Now we need to create a GitHub repository. You have two options:`);
    console.log(`
1. Create it manually on GitHub:
   - Go to https://github.com/new
   - Name: synthcore-2.0-mcp-server
   - Description: Synthcore 2.0 MCP Server with 12 agents
   - Choose Public or Private
   - Click "Create repository"

2. Use GitHub CLI (if you have it installed and authenticated)
`);
    
    const createMethod = await askQuestion("Would you like to create the repository manually (1) or use GitHub CLI (2)?");
    
    if (createMethod === '2') {
        // Check if GitHub CLI is installed
        const ghCheck = synthcoreExecute('gh --version', 'Checking if GitHub CLI is installed');
        
        if (ghCheck.success) {
            // Check if GitHub CLI is authenticated
            const authCheck = synthcoreExecute('gh auth status', 'Checking GitHub CLI authentication');
            
            if (authCheck.success) {
                synthcoreResponse("Creating GitHub repository using GitHub CLI...");
                synthcoreExecute(`gh repo create synthcore-2.0-mcp-server --public --description "Synthcore 2.0 MCP Server with 12 agents"`, 'Creating GitHub repository');
            } else {
                synthcoreResponse("GitHub CLI is not authenticated. Please run 'gh auth login' first, then try again.");
                console.log(`\n${Colors.YELLOW}After authenticating, you can create the repository with:${Colors.ENDC}`);
                console.log(`${Colors.BLUE}gh repo create synthcore-2.0-mcp-server --public --description "Synthcore 2.0 MCP Server with 12 agents"${Colors.ENDC}`);
                
                const manualCreate = await askQuestion("Have you created the repository manually on GitHub? (yes/no)");
                if (manualCreate.toLowerCase() !== 'yes') {
                    synthcoreResponse("Please create the repository on GitHub before continuing.");
                    rl.close();
                    return;
                }
            }
        } else {
            synthcoreResponse("GitHub CLI is not installed. Let's create the repository manually.");
            console.log(`\n${Colors.YELLOW}Please go to https://github.com/new and create a new repository:${Colors.ENDC}`);
            console.log(`- Name: synthcore-2.0-mcp-server`);
            console.log(`- Description: Synthcore 2.0 MCP Server with 12 agents`);
            console.log(`- Choose Public or Private`);
            console.log(`- Do NOT initialize with README, .gitignore, or license`);
            
            const manualCreate = await askQuestion("Have you created the repository on GitHub? (yes/no)");
            if (manualCreate.toLowerCase() !== 'yes') {
                synthcoreResponse("Please create the repository on GitHub before continuing.");
                rl.close();
                return;
            }
        }
    } else {
        console.log(`\n${Colors.YELLOW}Please go to https://github.com/new and create a new repository:${Colors.ENDC}`);
        console.log(`- Name: synthcore-2.0-mcp-server`);
        console.log(`- Description: Synthcore 2.0 MCP Server with 12 agents`);
        console.log(`- Choose Public or Private`);
        console.log(`- Do NOT initialize with README, .gitignore, or license`);
        
        const manualCreate = await askQuestion("Have you created the repository on GitHub? (yes/no)");
        if (manualCreate.toLowerCase() !== 'yes') {
            synthcoreResponse("Please create the repository on GitHub before continuing.");
            rl.close();
            return;
        }
    }
    
    // Step 8: Add remote and push
    synthcoreResponse("Now I'll connect your local repository to GitHub and push the code.");
    
    // Add remote
    synthcoreExecute(`git remote add origin https://github.com/${username}/synthcore-2.0-mcp-server.git`, 'Adding remote repository');
    
    // Set main branch
    synthcoreExecute('git branch -M main', 'Setting main branch');
    
    // Push to GitHub
    synthcoreResponse("Pushing code to GitHub. You may be prompted for your GitHub credentials.");
    synthcoreResponse("Note: GitHub no longer accepts passwords for Git operations. If prompted, use a personal access token instead of your password.");
    console.log(`\n${Colors.YELLOW}To create a personal access token:${Colors.ENDC}`);
    console.log(`1. Go to https://github.com/settings/tokens`);
    console.log(`2. Click "Generate new token"`);
    console.log(`3. Give it a name (e.g., "Synthcore 2.0 MCP Server")`);
    console.log(`4. Select the "repo" scope`);
    console.log(`5. Click "Generate token"`);
    console.log(`6. Copy the token (you won't be able to see it again)`);
    
    const readyToPush = await askQuestion("Are you ready to push to GitHub? (yes/no)");
    if (readyToPush.toLowerCase() === 'yes') {
        synthcoreExecute('git push -u origin main', 'Pushing to GitHub');
    } else {
        synthcoreResponse("You can push to GitHub later by running: git push -u origin main");
    }
    
    // Step 9: Verify and provide next steps
    synthcoreResponse("Deployment process completed!");
    synthcoreResponse(`You can view your repository at: https://github.com/${username}/synthcore-2.0-mcp-server`);
    synthcoreResponse("Thank you for using Synthcore 2.0 for your GitHub deployment.");
    
    rl.close();
}

// Run the deployment function
deployToGitHub().catch(error => {
    console.error(`${Colors.RED}Deployment failed: ${error.message}${Colors.ENDC}`);
    rl.close();
});
