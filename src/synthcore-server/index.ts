#!/usr/bin/env node
import {
  Server,
  StdioServerTransport,
  CallToolRequestSchema,
  ErrorCode,
  ListResourcesRequestSchema,
  ListResourceTemplatesRequestSchema,
  ListToolsRequestSchema,
  McpError,
  ReadResourceRequestSchema,
} from './types.js';
import dotenv from 'dotenv';
import { agentRegistry } from './agents/registry.js';
import { kernelManager } from './kernels/manager.js';
import { moduleLoader } from './modules/loader.js';
import { toolRegistry } from './tools/registry.js';
import { resourceRegistry } from './resources/registry.js';

// Load environment variables
dotenv.config();

// Constants from environment
const SERVER_NAME = process.env.SERVER_NAME || 'synthcore-2.0';
const SERVER_VERSION = process.env.SERVER_VERSION || '2.0.0';
const MIN_RESONANCE_THRESHOLD = parseFloat(process.env.MIN_RESONANCE_THRESHOLD || '0.6');
const MAX_ETHICAL_DRIFT = parseFloat(process.env.MAX_ETHICAL_DRIFT || '0.05');
const MAX_REFLEXIVE_INSTABILITY = parseFloat(process.env.MAX_REFLEXIVE_INSTABILITY || '0.08');

/**
 * Synthcore 2.0 MCP Server
 * 
 * A full-stack agentic AI server implementing the Model Context Protocol.
 * Includes agent registration, kernel binding, ethical controls, and tool orchestration.
 */
class SynthcoreServer {
  private server: Server;
  
  constructor() {
    // Initialize the MCP server
    this.server = new Server(
      {
        name: SERVER_NAME,
        version: SERVER_VERSION,
      },
      {
        capabilities: {
          resources: {},
          tools: {},
        },
      }
    );

    // Initialize components
    this.initializeComponents();
    
    // Set up request handlers
    this.setupResourceHandlers();
    this.setupToolHandlers();
    
    // Error handling
    this.server.onerror = (error) => console.error('[MCP Error]', error);
    process.on('SIGINT', async () => {
      await this.server.close();
      process.exit(0);
    });
  }

  /**
   * Initialize server components
   */
  private initializeComponents() {
    // Initialize kernel manager
    kernelManager.initialize();
    
    // Load modules
    moduleLoader.loadAllModules();
    
    // Register agents
    agentRegistry.registerAllAgents();
    
    // Bind agents to kernels
    agentRegistry.bindAgentsToKernels(kernelManager);
    
    console.error('[Synthcore] Server components initialized');
  }

  /**
   * Set up resource handlers
   */
  private setupResourceHandlers() {
    // List resources handler
    this.server.setRequestHandler(ListResourcesRequestSchema, async () => ({
      resources: resourceRegistry.getResourcesList(),
    }));

    // List resource templates handler
    this.server.setRequestHandler(
      ListResourceTemplatesRequestSchema,
      async () => ({
        resourceTemplates: resourceRegistry.getResourceTemplatesList(),
      })
    );

    // Read resource handler
    this.server.setRequestHandler(
      ReadResourceRequestSchema,
      async (request) => {
        try {
          return await resourceRegistry.handleResourceRequest(request.params.uri);
        } catch (error) {
          if (error instanceof McpError) {
            throw error;
          }
          throw new McpError(
            ErrorCode.InternalError,
            `Resource error: ${error instanceof Error ? error.message : String(error)}`
          );
        }
      }
    );
  }

  /**
   * Set up tool handlers
   */
  private setupToolHandlers() {
    // List tools handler
    this.server.setRequestHandler(ListToolsRequestSchema, async () => ({
      tools: toolRegistry.getToolsList(),
    }));

    // Call tool handler
    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      try {
        return await toolRegistry.handleToolCall(request.params.name, request.params.arguments);
      } catch (error) {
        if (error instanceof McpError) {
          throw error;
        }
        
        return {
          content: [
            {
              type: 'text',
              text: `Tool error: ${error instanceof Error ? error.message : String(error)}`,
            },
          ],
          isError: true,
        };
      }
    });
  }

  /**
   * Run the server
   */
  async run() {
    // Validate all agents meet resonance thresholds
    const validationResults = agentRegistry.validateAllAgents({
      minResonance: MIN_RESONANCE_THRESHOLD,
      maxEthicalDrift: MAX_ETHICAL_DRIFT,
      maxReflexiveInstability: MAX_REFLEXIVE_INSTABILITY
    });
    
    if (!validationResults.success) {
      console.error('[Synthcore] Agent validation failed:', validationResults.errors);
      process.exit(1);
    }
    
    console.error('[Synthcore] All agents validated successfully');
    
    // Connect to transport
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error('[Synthcore] MCP server running on stdio');
  }
}

// Create and run the server
const server = new SynthcoreServer();
server.run().catch(console.error);
