export class NPCMonitor {
  constructor() {
    this.trackedNPCs = new Map();
    this.errors = [];
    this.active = false;
  }

  start() {
    this.active = true;
    console.log('NPC Monitor started');
  }

  stop() {
    this.active = false;
  }

  getStatus() {
    return {
      activeNPCs: this.trackedNPCs.size,
      errors: this.errors.length
    };
  }

  getTrackedNPCs() {
    return Array.from(this.trackedNPCs.values());
  }

  trackNPC(npcId, data) {
    this.trackedNPCs.set(npcId, {
      id: npcId,
      ...data,
      lastUpdate: new Date()
    });
  }

  reportError(npcId, error) {
    this.errors.push({
      npcId,
      error,
      timestamp: new Date()
    });
  }
}
