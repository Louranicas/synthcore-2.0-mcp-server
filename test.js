#!/usr/bin/env node
import { spawn } from 'child_process';
import * as readline from 'readline';

console.log('Synthcore 2.0 MCP Server Test');
console.log('============================');

// Start the server
console.log('\nStarting the server...');
const server = spawn('node', ['build/synthcore-server/index.js'], {
  stdio: ['pipe', 'pipe', process.stderr]
});

// Create readline interface
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Handle server output
server.stdout.on('data', (data) => {
  console.log(`Server output: ${data}`);
});

// Handle server errors
server.on('error', (error) => {
  console.error(`Server error: ${error.message}`);
  process.exit(1);
});

// Wait for server to start
setTimeout(() => {
  console.log('\nServer started successfully.');
  console.log('\nTesting server functionality...');
  
  // Test calculate_resonance tool
  console.log('\nTesting calculate_resonance tool...');
  const request = {
    jsonrpc: '2.0',
    id: 1,
    method: 'callTool',
    params: {
      name: 'calculate_resonance',
      arguments: {
        text: 'This is a test message to analyze for resonance.'
      }
    }
  };
  
  server.stdin.write(JSON.stringify(request) + '\n');
  
  // Wait for response
  server.stdout.once('data', (data) => {
    try {
      const response = JSON.parse(data.toString());
      console.log('\nServer response:');
      console.log(JSON.stringify(response, null, 2));
      
      if (response.result && response.result.content) {
        console.log('\nTest completed successfully!');
      } else {
        console.error('\nTest failed: Invalid response format');
      }
      
      // Ask if user wants to continue testing
      rl.question('\nDo you want to test another tool? (y/n) ', (answer) => {
        if (answer.toLowerCase() === 'y') {
          showToolMenu();
        } else {
          console.log('\nShutting down server...');
          server.kill();
          rl.close();
          process.exit(0);
        }
      });
    } catch (error) {
      console.error(`\nError parsing response: ${error.message}`);
      console.log('\nShutting down server...');
      server.kill();
      rl.close();
      process.exit(1);
    }
  });
}, 2000);

// Show tool menu
function showToolMenu() {
  console.log('\nAvailable tools:');
  console.log('1. calculate_resonance');
  console.log('2. analyze_ethics');
  console.log('3. get_agent_status');
  console.log('4. Exit');
  
  rl.question('\nSelect a tool to test (1-4): ', (answer) => {
    switch (answer) {
      case '1':
        testCalculateResonance();
        break;
      case '2':
        testAnalyzeEthics();
        break;
      case '3':
        testGetAgentStatus();
        break;
      case '4':
        console.log('\nShutting down server...');
        server.kill();
        rl.close();
        process.exit(0);
        break;
      default:
        console.log('\nInvalid selection. Please try again.');
        showToolMenu();
        break;
    }
  });
}

// Test calculate_resonance tool
function testCalculateResonance() {
  console.log('\nTesting calculate_resonance tool...');
  rl.question('\nEnter text to analyze: ', (text) => {
    const request = {
      jsonrpc: '2.0',
      id: 1,
      method: 'callTool',
      params: {
        name: 'calculate_resonance',
        arguments: {
          text
        }
      }
    };
    
    server.stdin.write(JSON.stringify(request) + '\n');
    
    // Wait for response
    server.stdout.once('data', (data) => {
      try {
        const response = JSON.parse(data.toString());
        console.log('\nServer response:');
        console.log(JSON.stringify(response, null, 2));
        
        // Ask if user wants to continue testing
        rl.question('\nDo you want to test another tool? (y/n) ', (answer) => {
          if (answer.toLowerCase() === 'y') {
            showToolMenu();
          } else {
            console.log('\nShutting down server...');
            server.kill();
            rl.close();
            process.exit(0);
          }
        });
      } catch (error) {
        console.error(`\nError parsing response: ${error.message}`);
        console.log('\nShutting down server...');
        server.kill();
        rl.close();
        process.exit(1);
      }
    });
  });
}

// Test analyze_ethics tool
function testAnalyzeEthics() {
  console.log('\nTesting analyze_ethics tool...');
  rl.question('\nEnter text to analyze: ', (text) => {
    const request = {
      jsonrpc: '2.0',
      id: 1,
      method: 'callTool',
      params: {
        name: 'analyze_ethics',
        arguments: {
          text
        }
      }
    };
    
    server.stdin.write(JSON.stringify(request) + '\n');
    
    // Wait for response
    server.stdout.once('data', (data) => {
      try {
        const response = JSON.parse(data.toString());
        console.log('\nServer response:');
        console.log(JSON.stringify(response, null, 2));
        
        // Ask if user wants to continue testing
        rl.question('\nDo you want to test another tool? (y/n) ', (answer) => {
          if (answer.toLowerCase() === 'y') {
            showToolMenu();
          } else {
            console.log('\nShutting down server...');
            server.kill();
            rl.close();
            process.exit(0);
          }
        });
      } catch (error) {
        console.error(`\nError parsing response: ${error.message}`);
        console.log('\nShutting down server...');
        server.kill();
        rl.close();
        process.exit(1);
      }
    });
  });
}

// Test get_agent_status tool
function testGetAgentStatus() {
  console.log('\nTesting get_agent_status tool...');
  rl.question('\nEnter agent name (e.g., Navigator, PALMA, Alex): ', (agentName) => {
    const request = {
      jsonrpc: '2.0',
      id: 1,
      method: 'callTool',
      params: {
        name: 'get_agent_status',
        arguments: {
          agentName
        }
      }
    };
    
    server.stdin.write(JSON.stringify(request) + '\n');
    
    // Wait for response
    server.stdout.once('data', (data) => {
      try {
        const response = JSON.parse(data.toString());
        console.log('\nServer response:');
        console.log(JSON.stringify(response, null, 2));
        
        // Ask if user wants to continue testing
        rl.question('\nDo you want to test another tool? (y/n) ', (answer) => {
          if (answer.toLowerCase() === 'y') {
            showToolMenu();
          } else {
            console.log('\nShutting down server...');
            server.kill();
            rl.close();
            process.exit(0);
          }
        });
      } catch (error) {
        console.error(`\nError parsing response: ${error.message}`);
        console.log('\nShutting down server...');
        server.kill();
        rl.close();
        process.exit(1);
      }
    });
  });
}
