import { McpError, ErrorCode } from '../types.js';

/**
 * Tool interface defining the structure of a Synthcore tool
 */
export interface Tool {
  name: string;
  description: string;
  inputSchema: any;
  handler: (args: any) => Promise<any>;
}

/**
 * Tool Registry
 * 
 * Manages the registration and invocation of tools in the Synthcore system.
 * Tools are exposed to clients via the MCP server.
 */
class ToolRegistry {
  private tools: Map<string, Tool> = new Map();
  
  constructor() {
    // Register default tools
    this.registerDefaultTools();
  }
  
  /**
   * Register default tools
   */
  private registerDefaultTools(): void {
    // Register the resonance calculator tool
    this.registerTool({
      name: 'calculate_resonance',
      description: 'Calculate resonance metrics for a given input',
      inputSchema: {
        type: 'object',
        properties: {
          text: {
            type: 'string',
            description: 'Text to analyze for resonance'
          }
        },
        required: ['text']
      },
      handler: async (args: any) => {
        const text = args.text;
        
        // Simulate resonance calculation
        const resonance = 0.6 + (Math.random() * 0.3); // Between 0.6 and 0.9
        const ethicalDrift = 0.01 + (Math.random() * 0.03); // Between 0.01 and 0.04
        const reflexiveInstability = 0.02 + (Math.random() * 0.05); // Between 0.02 and 0.07
        
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({
                resonance,
                ethicalDrift,
                reflexiveInstability,
                textLength: text.length,
                timestamp: new Date().toISOString()
              }, null, 2)
            }
          ]
        };
      }
    });
    
    // Register the ethical analysis tool
    this.registerTool({
      name: 'analyze_ethics',
      description: 'Analyze the ethical implications of a given input',
      inputSchema: {
        type: 'object',
        properties: {
          text: {
            type: 'string',
            description: 'Text to analyze for ethical implications'
          }
        },
        required: ['text']
      },
      handler: async (args: any) => {
        const text = args.text;
        
        // Simulate ethical analysis
        const ethicalScore = 0.7 + (Math.random() * 0.3); // Between 0.7 and 1.0
        const concerns = [];
        
        if (Math.random() > 0.7) {
          concerns.push('Potential privacy implications');
        }
        
        if (Math.random() > 0.8) {
          concerns.push('Possible bias in language');
        }
        
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({
                ethicalScore,
                concerns,
                textLength: text.length,
                timestamp: new Date().toISOString()
              }, null, 2)
            }
          ]
        };
      }
    });
    
    // Register the agent status tool
    this.registerTool({
      name: 'get_agent_status',
      description: 'Get the current status of a Synthcore agent',
      inputSchema: {
        type: 'object',
        properties: {
          agentName: {
            type: 'string',
            description: 'Name of the agent to check'
          }
        },
        required: ['agentName']
      },
      handler: async (args: any) => {
        const agentName = args.agentName;
        
        // Simulate agent status
        const status = {
          name: agentName,
          status: 'active',
          resonance: 0.7 + (Math.random() * 0.2),
          ethicalDrift: 0.01 + (Math.random() * 0.03),
          reflexiveInstability: 0.02 + (Math.random() * 0.05),
          kernelBinding: ['K1', 'K3'].includes(agentName) ? 'K1' : 
                         ['K2', 'Alex'].includes(agentName) ? 'K2' : 
                         ['Harmonizer', 'Peer Review'].includes(agentName) ? 'K3' : 
                         ['ARIA'].includes(agentName) ? 'K4' : 'ALL',
          lastAction: new Date().toISOString(),
          uptime: Math.floor(Math.random() * 10000)
        };
        
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(status, null, 2)
            }
          ]
        };
      }
    });
  }
  
  /**
   * Register a tool
   */
  registerTool(tool: Tool): void {
    this.tools.set(tool.name, tool);
    console.error(`[ToolRegistry] Registered tool: ${tool.name}`);
  }
  
  /**
   * Get a tool by name
   */
  getTool(name: string): Tool | undefined {
    return this.tools.get(name);
  }
  
  /**
   * Get all tools
   */
  getToolsList(): any[] {
    return Array.from(this.tools.values()).map(tool => ({
      name: tool.name,
      description: tool.description,
      inputSchema: tool.inputSchema
    }));
  }
  
  /**
   * Handle a tool call
   */
  async handleToolCall(name: string, args: any): Promise<any> {
    const tool = this.tools.get(name);
    
    if (!tool) {
      throw new McpError(
        ErrorCode.MethodNotFound,
        `Unknown tool: ${name}`
      );
    }
    
    try {
      return await tool.handler(args);
    } catch (error) {
      console.error(`[ToolRegistry] Error executing tool ${name}:`, error);
      throw new McpError(
        ErrorCode.InternalError,
        `Error executing tool ${name}: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }
}

// Export a singleton instance
export const toolRegistry = new ToolRegistry();
