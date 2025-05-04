/**
 * This file contains type definitions for the MCP SDK.
 * These are placeholder definitions to allow the code to compile.
 * In a real implementation, these would be provided by the actual SDK.
 */

// Server class
export class Server {
  onerror: (error: any) => void = () => {};
  
  constructor(info: any, options: any) {
    console.error(`[Server] Initialized server: ${info.name} v${info.version}`);
  }
  
  setRequestHandler(schema: any, handler: (request: any) => Promise<any>): void {
    console.error(`[Server] Registered handler for schema: ${schema.toString()}`);
  }
  
  async connect(transport: any): Promise<void> {
    console.error('[Server] Connected to transport');
  }
  
  async close(): Promise<void> {
    console.error('[Server] Closed server');
  }
}

// Transport interfaces
export interface ServerTransport {
  // Transport interface
}

// StdioServerTransport class
export class StdioServerTransport implements ServerTransport {
  constructor() {
    console.error('[Transport] Initialized stdio transport');
  }
}

// Request schemas
export const ListResourcesRequestSchema = Symbol('ListResourcesRequest');
export const ListResourceTemplatesRequestSchema = Symbol('ListResourceTemplatesRequest');
export const ReadResourceRequestSchema = Symbol('ReadResourceRequest');
export const ListToolsRequestSchema = Symbol('ListToolsRequest');
export const CallToolRequestSchema = Symbol('CallToolRequest');

// Error codes
export enum ErrorCode {
  InvalidRequest = 'InvalidRequest',
  MethodNotFound = 'MethodNotFound',
  InvalidParams = 'InvalidParams',
  InternalError = 'InternalError'
}

// Error class
export class McpError extends Error {
  code: ErrorCode;
  
  constructor(code: ErrorCode, message: string) {
    super(message);
    this.code = code;
    this.name = 'McpError';
  }
}
