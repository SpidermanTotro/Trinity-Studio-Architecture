import os from 'os';

export class MetricsCollector {
  constructor() {
    this.metrics = {
      activePlayers: 0,
      cpuUsage: 0,
      memoryUsage: 0
    };
    this.logs = [];
    this.interval = null;
  }

  start(intervalMs = 5000) {
    this.interval = setInterval(() => {
      this.collectMetrics();
    }, intervalMs);
  }

  stop() {
    if (this.interval) {
      clearInterval(this.interval);
    }
  }

  collectMetrics() {
    // CPU usage (simplified)
    const cpus = os.cpus();
    const avgLoad = os.loadavg()[0];
    this.metrics.cpuUsage = Math.min(100, (avgLoad / cpus.length) * 100).toFixed(2);

    // Memory usage
    const totalMem = os.totalmem();
    const freeMem = os.freemem();
    this.metrics.memoryUsage = ((totalMem - freeMem) / 1024 / 1024).toFixed(2);

    // Log collection
    this.addLog('info', `Metrics collected: CPU ${this.metrics.cpuUsage}%, Memory ${this.metrics.memoryUsage}MB`);
  }

  getMetrics() {
    return this.metrics;
  }

  addLog(level, message) {
    this.logs.unshift({
      level,
      message,
      timestamp: new Date()
    });

    // Keep only last 1000 logs
    if (this.logs.length > 1000) {
      this.logs = this.logs.slice(0, 1000);
    }
  }

  getLogs(level, limit = 100) {
    let logs = this.logs;
    
    if (level) {
      logs = logs.filter(log => log.level === level);
    }

    return logs.slice(0, limit);
  }
}
