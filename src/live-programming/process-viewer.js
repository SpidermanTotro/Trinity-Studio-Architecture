export class ProcessViewer {
  constructor() {
    this.processes = new Map();
    this.combatLogs = [];
    this.npcBehaviors = [];
  }

  logCombatEvent(event) {
    this.combatLogs.push({
      ...event,
      timestamp: new Date()
    });

    // Keep only last 10000 events
    if (this.combatLogs.length > 10000) {
      this.combatLogs = this.combatLogs.slice(-10000);
    }
  }

  trackNPCBehavior(npcId, behavior) {
    this.npcBehaviors.push({
      npcId,
      behavior,
      timestamp: new Date()
    });

    // Keep only last 5000 behaviors
    if (this.npcBehaviors.length > 5000) {
      this.npcBehaviors = this.npcBehaviors.slice(-5000);
    }
  }

  getCombatLogs(limit = 100) {
    return this.combatLogs.slice(-limit);
  }

  getNPCBehaviors(npcId, limit = 100) {
    if (npcId) {
      return this.npcBehaviors
        .filter(b => b.npcId === npcId)
        .slice(-limit);
    }
    return this.npcBehaviors.slice(-limit);
  }

  registerProcess(name, process) {
    this.processes.set(name, {
      name,
      process,
      startTime: new Date(),
      status: 'running'
    });
  }

  getProcesses() {
    return Array.from(this.processes.values());
  }
}
