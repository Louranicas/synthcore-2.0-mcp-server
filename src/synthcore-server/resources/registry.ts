import { McpError, ErrorCode } from '../types.js';

/**
 * Resource interface defining the structure of a Synthcore resource
 */
export interface Resource {
  uri: string;
  name: string;
  description?: string;
  mimeType?: string;
}

/**
 * Resource Template interface defining the structure of a Synthcore resource template
 */
export interface ResourceTemplate {
  uriTemplate: string;
  name: string;
  description?: string;
  mimeType?: string;
}

/**
 * Resource Registry
 * 
 * Manages the registration and access of resources in the Synthcore system.
 * Resources are exposed to clients via the MCP server.
 */
class ResourceRegistry {
  private resources: Map<string, Resource> = new Map();
  private resourceTemplates: Map<string, ResourceTemplate> = new Map();
  
  constructor() {
    // Register default resources and templates
    this.registerDefaultResources();
    this.registerDefaultResourceTemplates();
  }
  
  /**
   * Register default resources
   */
  private registerDefaultResources(): void {
    // Register the system status resource
    this.registerResource({
      uri: 'synthcore://system/status',
      name: 'System Status',
      description: 'Current status of the Synthcore system',
      mimeType: 'application/json'
    });
    
    // Register the agent manifest resource
    this.registerResource({
      uri: 'synthcore://agents/manifest',
      name: 'Agent Manifest',
      description: 'List of all agents in the Synthcore system',
      mimeType: 'application/json'
    });
    
    // Register the kernel status resource
    this.registerResource({
      uri: 'synthcore://kernels/status',
      name: 'Kernel Status',
      description: 'Current status of all kernels in the system',
      mimeType: 'application/json'
    });
  }
  
  /**
   * Register default resource templates
   */
  private registerDefaultResourceTemplates(): void {
    // Register the agent status template
    this.registerResourceTemplate({
      uriTemplate: 'synthcore://agents/{agentName}/status',
      name: 'Agent Status',
      description: 'Status of a specific agent',
      mimeType: 'application/json'
    });
    
    // Register the kernel info template
    this.registerResourceTemplate({
      uriTemplate: 'synthcore://kernels/{kernelId}/info',
      name: 'Kernel Info',
      description: 'Information about a specific kernel',
      mimeType: 'application/json'
    });
    
    // Register the module info template
    this.registerResourceTemplate({
      uriTemplate: 'synthcore://modules/{moduleId}/info',
      name: 'Module Info',
      description: 'Information about a specific module',
      mimeType: 'application/json'
    });
  }
  
  /**
   * Register a resource
   */
  registerResource(resource: Resource): void {
    this.resources.set(resource.uri, resource);
    console.error(`[ResourceRegistry] Registered resource: ${resource.name} (${resource.uri})`);
  }
  
  /**
   * Register a resource template
   */
  registerResourceTemplate(template: ResourceTemplate): void {
    this.resourceTemplates.set(template.uriTemplate, template);
    console.error(`[ResourceRegistry] Registered resource template: ${template.name} (${template.uriTemplate})`);
  }
  
  /**
   * Get a resource by URI
   */
  getResource(uri: string): Resource | undefined {
    return this.resources.get(uri);
  }
  
  /**
   * Get all resources
   */
  getResourcesList(): Resource[] {
    return Array.from(this.resources.values());
  }
  
  /**
   * Get all resource templates
   */
  getResourceTemplatesList(): ResourceTemplate[] {
    return Array.from(this.resourceTemplates.values());
  }
  
  /**
   * Handle a resource request
   */
  async handleResourceRequest(uri: string): Promise<any> {
    // Check if it's a direct resource
    const resource = this.resources.get(uri);
    
    if (resource) {
      return this.generateResourceContent(resource);
    }
    
    // Check if it matches a template
    for (const [templateUri, template] of this.resourceTemplates.entries()) {
      const match = this.matchUriTemplate(uri, templateUri);
      
      if (match) {
        return this.generateTemplateContent(template, match);
      }
    }
    
    // No matching resource or template
    throw new McpError(
      ErrorCode.InvalidRequest,
      `Invalid URI format: ${uri}`
    );
  }
  
  /**
   * Match a URI against a template
   */
  private matchUriTemplate(uri: string, template: string): Record<string, string> | null {
    const templateParts = template.split('/');
    const uriParts = uri.split('/');
    
    if (templateParts.length !== uriParts.length) {
      return null;
    }
    
    const params: Record<string, string> = {};
    
    for (let i = 0; i < templateParts.length; i++) {
      const templatePart = templateParts[i];
      const uriPart = uriParts[i];
      
      if (templatePart.startsWith('{') && templatePart.endsWith('}')) {
        // This is a parameter
        const paramName = templatePart.slice(1, -1);
        params[paramName] = decodeURIComponent(uriPart);
      } else if (templatePart !== uriPart) {
        // This part doesn't match
        return null;
      }
    }
    
    return params;
  }
  
  /**
   * Generate content for a direct resource
   */
  private async generateResourceContent(resource: Resource): Promise<any> {
    let content = '';
    
    switch (resource.uri) {
      case 'synthcore://system/status':
        content = JSON.stringify({
          status: 'active',
          version: '2.0.0',
          uptime: Math.floor(Math.random() * 10000),
          agentCount: 8,
          kernelCount: 5,
          moduleCount: 12,
          timestamp: new Date().toISOString()
        }, null, 2);
        break;
        
      case 'synthcore://agents/manifest':
        content = JSON.stringify({
          agents: [
            { name: "Navigator", kernelId: "K1", modules: ["context_engine", "ledger.tracing", "tool.calling"] },
            { name: "Alex", kernelId: "K2", modules: ["tool.calling", "drift_balancer", "agent.bridge"] },
            { name: "PALMA", kernelId: "ALL", modules: ["ethics.guard", "resonance.compute", "cache.overlay"] },
            { name: "Harmonizer", kernelId: "K3", modules: ["resonance.compute", "ethics.guard"] },
            { name: "Peer Review", kernelId: "K3", modules: ["ethics.guard", "ledger.tracing"] },
            { name: "ARIA", kernelId: "K4", modules: ["reflexive.state", "resonance.topograph"] },
            { name: "The Watcher", kernelId: "ALL", modules: ["telemetry.otlp", "ledger.tracing", "cache.overlay"] },
            { name: "Synthcore 2.0", kernelId: "ALL", modules: ["mcp.kernel.sync", "agent.bridge", "tool.calling", "context_engine"] }
          ]
        }, null, 2);
        break;
        
      case 'synthcore://kernels/status':
        content = JSON.stringify({
          kernels: [
            { id: 'K1', name: 'Reflexive Kernel', status: 'active', agentCount: 2 },
            { id: 'K2', name: 'Agentic Kernel', status: 'active', agentCount: 2 },
            { id: 'K3', name: 'Ethical Kernel', status: 'active', agentCount: 3 },
            { id: 'K4', name: 'Stewardship Kernel', status: 'active', agentCount: 2 },
            { id: 'ALL', name: 'Meta Kernel', status: 'active', agentCount: 3 }
          ]
        }, null, 2);
        break;
        
      default:
        throw new McpError(
          ErrorCode.InvalidRequest,
          `Unknown resource URI: ${resource.uri}`
        );
    }
    
    return {
      contents: [
        {
          uri: resource.uri,
          mimeType: resource.mimeType || 'application/json',
          text: content
        }
      ]
    };
  }
  
  /**
   * Generate content for a template resource
   */
  private async generateTemplateContent(template: ResourceTemplate, params: Record<string, string>): Promise<any> {
    let content = '';
    
    if (template.uriTemplate === 'synthcore://agents/{agentName}/status') {
      const agentName = params.agentName;
      
      content = JSON.stringify({
        name: agentName,
        status: 'active',
        resonance: 0.7 + (Math.random() * 0.2),
        ethicalDrift: 0.01 + (Math.random() * 0.03),
        reflexiveInstability: 0.02 + (Math.random() * 0.05),
        kernelBinding: ['Navigator', 'K1'].includes(agentName) ? 'K1' : 
                       ['Alex', 'K2'].includes(agentName) ? 'K2' : 
                       ['Harmonizer', 'Peer Review'].includes(agentName) ? 'K3' : 
                       ['ARIA'].includes(agentName) ? 'K4' : 'ALL',
        lastAction: new Date().toISOString(),
        uptime: Math.floor(Math.random() * 10000)
      }, null, 2);
    } else if (template.uriTemplate === 'synthcore://kernels/{kernelId}/info') {
      const kernelId = params.kernelId;
      
      content = JSON.stringify({
        id: kernelId,
        name: kernelId === 'K1' ? 'Reflexive Kernel' :
              kernelId === 'K2' ? 'Agentic Kernel' :
              kernelId === 'K3' ? 'Ethical Kernel' :
              kernelId === 'K4' ? 'Stewardship Kernel' : 'Meta Kernel',
        description: kernelId === 'K1' ? 'Handles reflexive intelligence and self-awareness' :
                     kernelId === 'K2' ? 'Manages agent actions and tool orchestration' :
                     kernelId === 'K3' ? 'Enforces ethical constraints and drift control' :
                     kernelId === 'K4' ? 'Handles long-term planning and resource management' : 
                     'Meta-kernel that spans all four core kernels',
        status: 'active',
        boundAgents: this.getAgentsForKernel(kernelId),
        metrics: {
          stability: 0.8 + (Math.random() * 0.2),
          coherence: 0.7 + (Math.random() * 0.2),
          efficiency: 0.75 + (Math.random() * 0.2)
        }
      }, null, 2);
    } else if (template.uriTemplate === 'synthcore://modules/{moduleId}/info') {
      const moduleId = params.moduleId;
      
      content = JSON.stringify({
        id: moduleId,
        name: this.getModuleName(moduleId),
        description: this.getModuleDescription(moduleId),
        status: 'active',
        usedByAgents: this.getAgentsUsingModule(moduleId),
        metrics: {
          performance: 0.7 + (Math.random() * 0.3),
          reliability: 0.8 + (Math.random() * 0.2),
          lastUpdated: new Date().toISOString()
        }
      }, null, 2);
    } else {
      throw new McpError(
        ErrorCode.InvalidRequest,
        `Unknown resource template: ${template.uriTemplate}`
      );
    }
    
    const uri = template.uriTemplate.replace(/{([^}]+)}/g, (_, key) => params[key]);
    
    return {
      contents: [
        {
          uri,
          mimeType: template.mimeType || 'application/json',
          text: content
        }
      ]
    };
  }
  
  /**
   * Get agents for a specific kernel
   */
  private getAgentsForKernel(kernelId: string): string[] {
    switch (kernelId) {
      case 'K1':
        return ['Navigator'];
      case 'K2':
        return ['Alex'];
      case 'K3':
        return ['Harmonizer', 'Peer Review'];
      case 'K4':
        return ['ARIA'];
      case 'ALL':
        return ['PALMA', 'The Watcher', 'Synthcore 2.0'];
      default:
        return [];
    }
  }
  
  /**
   * Get module name from ID
   */
  private getModuleName(moduleId: string): string {
    const moduleNames: Record<string, string> = {
      'context_engine': 'Context Engine',
      'ledger.tracing': 'Ledger Tracing',
      'tool.calling': 'Tool Calling',
      'drift_balancer': 'Drift Balancer',
      'agent.bridge': 'Agent Bridge',
      'ethics.guard': 'Ethics Guard',
      'resonance.compute': 'Resonance Compute',
      'cache.overlay': 'Cache Overlay',
      'reflexive.state': 'Reflexive State',
      'resonance.topograph': 'Resonance Topograph',
      'telemetry.otlp': 'Telemetry OTLP',
      'mcp.kernel.sync': 'Kernel Sync'
    };
    
    return moduleNames[moduleId] || moduleId;
  }
  
  /**
   * Get module description from ID
   */
  private getModuleDescription(moduleId: string): string {
    const moduleDescriptions: Record<string, string> = {
      'context_engine': 'Manages context propagation and state transitions',
      'ledger.tracing': 'Provides tracing and logging capabilities',
      'tool.calling': 'Manages tool invocation and result handling',
      'drift_balancer': 'Manages ethical drift and resonance stability',
      'agent.bridge': 'Facilitates agent-to-agent communication',
      'ethics.guard': 'Enforces ethical constraints and monitors drift',
      'resonance.compute': 'Calculates resonance metrics and stability',
      'cache.overlay': 'Provides shared memory and caching capabilities',
      'reflexive.state': 'Manages agent self-awareness and reflection',
      'resonance.topograph': 'Maps resonance fields and attractors',
      'telemetry.otlp': 'Provides OpenTelemetry integration',
      'mcp.kernel.sync': 'Synchronizes kernel states and transitions'
    };
    
    return moduleDescriptions[moduleId] || 'No description available';
  }
  
  /**
   * Get agents using a specific module
   */
  private getAgentsUsingModule(moduleId: string): string[] {
    const moduleToAgents: Record<string, string[]> = {
      'context_engine': ['Navigator', 'Synthcore 2.0'],
      'ledger.tracing': ['Navigator', 'Peer Review', 'The Watcher'],
      'tool.calling': ['Navigator', 'Alex', 'Synthcore 2.0'],
      'drift_balancer': ['Alex'],
      'agent.bridge': ['Alex', 'Synthcore 2.0'],
      'ethics.guard': ['PALMA', 'Harmonizer', 'Peer Review'],
      'resonance.compute': ['PALMA', 'Harmonizer'],
      'cache.overlay': ['PALMA', 'The Watcher'],
      'reflexive.state': ['ARIA'],
      'resonance.topograph': ['ARIA'],
      'telemetry.otlp': ['The Watcher'],
      'mcp.kernel.sync': ['Synthcore 2.0']
    };
    
    return moduleToAgents[moduleId] || [];
  }
}

// Export a singleton instance
export const resourceRegistry = new ResourceRegistry();
