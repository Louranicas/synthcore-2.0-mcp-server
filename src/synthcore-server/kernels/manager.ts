/**
 * Kernel interface defining the structure of a Synthcore kernel
 */
export interface Kernel {
  id: string;
  name: string;
  description: string;
  boundAgents: string[];
}

/**
 * Kernel Manager
 * 
 * Manages the kernels (𝒦₁–𝒦₄) in the Synthcore system.
 * Kernels represent the core logical components that agents bind to.
 */
export class KernelManager {
  private kernels: Map<string, Kernel> = new Map();
  
  /**
   * Initialize the kernel manager with the four core kernels
   */
  initialize(): void {
    // Create the four core kernels (𝒦₁–𝒦₄)
    this.createKernel({
      id: 'K1',
      name: 'Reflexive Kernel',
      description: 'Handles reflexive intelligence and self-awareness',
      boundAgents: []
    });
    
    this.createKernel({
      id: 'K2',
      name: 'Agentic Kernel',
      description: 'Manages agent actions and tool orchestration',
      boundAgents: []
    });
    
    this.createKernel({
      id: 'K3',
      name: 'Ethical Kernel',
      description: 'Enforces ethical constraints and drift control',
      boundAgents: []
    });
    
    this.createKernel({
      id: 'K4',
      name: 'Stewardship Kernel',
      description: 'Handles long-term planning and resource management',
      boundAgents: []
    });
    
    // Create the ALL kernel for agents that bind to all kernels
    this.createKernel({
      id: 'ALL',
      name: 'Meta Kernel',
      description: 'Meta-kernel that spans all four core kernels',
      boundAgents: []
    });
    
    console.error(`[KernelManager] Initialized ${this.kernels.size} kernels`);
  }
  
  /**
   * Create a new kernel
   */
  createKernel(kernel: Kernel): void {
    this.kernels.set(kernel.id, kernel);
    console.error(`[KernelManager] Created kernel: ${kernel.name} (${kernel.id})`);
  }
  
  /**
   * Get a kernel by ID
   */
  getKernel(id: string): Kernel | undefined {
    return this.kernels.get(id);
  }
  
  /**
   * Get all kernels
   */
  getAllKernels(): Kernel[] {
    return Array.from(this.kernels.values());
  }
  
  /**
   * Bind an agent to a kernel
   */
  bindAgentToKernel(agentName: string, kernelId: string): void {
    const kernel = this.kernels.get(kernelId);
    
    if (!kernel) {
      console.error(`[KernelManager] Error: Cannot bind agent ${agentName} to non-existent kernel ${kernelId}`);
      return;
    }
    
    kernel.boundAgents.push(agentName);
    console.error(`[KernelManager] Bound agent ${agentName} to kernel ${kernel.name} (${kernelId})`);
    
    // If binding to ALL, also bind to each individual kernel
    if (kernelId === 'ALL') {
      for (const k of this.kernels.values()) {
        if (k.id !== 'ALL') {
          k.boundAgents.push(agentName);
          console.error(`[KernelManager] Also bound agent ${agentName} to kernel ${k.name} (${k.id})`);
        }
      }
    }
  }
  
  /**
   * Get all agents bound to a specific kernel
   */
  getAgentsBoundToKernel(kernelId: string): string[] {
    const kernel = this.kernels.get(kernelId);
    return kernel ? [...kernel.boundAgents] : [];
  }
}

// Export a singleton instance
export const kernelManager = new KernelManager();
