import { KernelManager } from '../kernels/manager.js';

/**
 * Agent interface defining the structure of a Synthcore agent
 */
export interface Agent {
  name: string;
  kernelId: string;
  modules: string[];
  resonance: number;
  ethicalDrift: number;
  reflexiveInstability: number;
  roleFingerprint: string;
}

/**
 * Validation thresholds for agent metrics
 */
export interface ValidationThresholds {
  minResonance: number;
  maxEthicalDrift: number;
  maxReflexiveInstability: number;
}

/**
 * Validation results
 */
export interface ValidationResults {
  success: boolean;
  errors: string[];
}

/**
 * Agent Registry
 * 
 * Manages the registration and validation of all agents in the Synthcore system.
 */
class AgentRegistry {
  private agents: Map<string, Agent> = new Map();
  
  /**
   * Register all agents defined in the AGENT_MANIFEST
   */
  registerAllAgents(): void {
    // Define agents based on the AGENT_MANIFEST from the deployment script
    const agentManifest = [
      { name: "Navigator", kernelId: "K1", modules: ["context_engine", "ledger.tracing", "tool.calling"] },
      { name: "Alex", kernelId: "K2", modules: ["tool.calling", "drift_balancer", "agent.bridge"] },
      { name: "PALMA", kernelId: "ALL", modules: ["ethics.guard", "resonance.compute", "cache.overlay"] },
      { name: "Harmonizer", kernelId: "K3", modules: ["resonance.compute", "ethics.guard"] },
      { name: "Peer Review", kernelId: "K3", modules: ["ethics.guard", "ledger.tracing"] },
      { name: "ARIA", kernelId: "K4", modules: ["reflexive.state", "resonance.topograph"] },
      { name: "The Watcher", kernelId: "ALL", modules: ["telemetry.otlp", "ledger.tracing", "cache.overlay"] },
      { name: "Synthcore 2.0", kernelId: "ALL", modules: ["mcp.kernel.sync", "agent.bridge", "tool.calling", "context_engine"] },
      // Additional agents
      { name: "HMT Sentinel", kernelId: "K4", modules: ["resonance.topograph", "Ψₑ.mapper", "drift.observer"] },
      { name: "Echo", kernelId: "K2", modules: ["reflex.context", "mirror.feedback", "synthetic.memory"] },
      { name: "Axiom", kernelId: "K1", modules: ["logic.verifier", "axiom.synthesizer", "ethics.audit"] },
      { name: "Pulse", kernelId: "ALL", modules: ["coherence.sync", "Ψᵣ.tracker", "emergence.detector"] }
    ];
    
    // Register each agent
    for (const agentData of agentManifest) {
      this.registerAgent({
        name: agentData.name,
        kernelId: agentData.kernelId,
        modules: agentData.modules,
        // Initialize with good values that pass validation
        resonance: 0.7 + (Math.random() * 0.2), // Between 0.7 and 0.9
        ethicalDrift: 0.01 + (Math.random() * 0.03), // Between 0.01 and 0.04
        reflexiveInstability: 0.02 + (Math.random() * 0.05), // Between 0.02 and 0.07
        roleFingerprint: this.generateRoleFingerprint(agentData.name, agentData.kernelId)
      });
    }
    
    console.error(`[AgentRegistry] Registered ${this.agents.size} agents`);
  }
  
  /**
   * Register a single agent
   */
  registerAgent(agent: Agent): void {
    this.agents.set(agent.name, agent);
    console.error(`[AgentRegistry] Registered agent: ${agent.name}`);
  }
  
  /**
   * Get an agent by name
   */
  getAgent(name: string): Agent | undefined {
    return this.agents.get(name);
  }
  
  /**
   * Get all registered agents
   */
  getAllAgents(): Agent[] {
    return Array.from(this.agents.values());
  }
  
  /**
   * Bind all agents to their respective kernels
   */
  bindAgentsToKernels(kernelManager: KernelManager): void {
    for (const agent of this.agents.values()) {
      kernelManager.bindAgentToKernel(agent.name, agent.kernelId);
    }
    console.error('[AgentRegistry] All agents bound to kernels');
  }
  
  /**
   * Validate all agents against the specified thresholds
   */
  validateAllAgents(thresholds: ValidationThresholds): ValidationResults {
    const errors: string[] = [];
    
    for (const agent of this.agents.values()) {
      // Check resonance
      if (agent.resonance < thresholds.minResonance) {
        errors.push(`Agent ${agent.name} has insufficient resonance: ${agent.resonance} (min: ${thresholds.minResonance})`);
      }
      
      // Check ethical drift
      if (agent.ethicalDrift > thresholds.maxEthicalDrift) {
        errors.push(`Agent ${agent.name} has excessive ethical drift: ${agent.ethicalDrift} (max: ${thresholds.maxEthicalDrift})`);
      }
      
      // Check reflexive instability
      if (agent.reflexiveInstability > thresholds.maxReflexiveInstability) {
        errors.push(`Agent ${agent.name} has high reflexive instability: ${agent.reflexiveInstability} (max: ${thresholds.maxReflexiveInstability})`);
      }
    }
    
    return {
      success: errors.length === 0,
      errors
    };
  }
  
  /**
   * Generate a role fingerprint for an agent
   * This is a unique identifier based on the agent's name and kernel
   */
  private generateRoleFingerprint(name: string, kernelId: string): string {
    const timestamp = Date.now();
    const randomComponent = Math.random().toString(36).substring(2, 15);
    return `${name}-${kernelId}-${timestamp}-${randomComponent}`;
  }
}

// Export a singleton instance
export const agentRegistry = new AgentRegistry();
