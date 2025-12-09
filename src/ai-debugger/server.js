import express from 'express';
import { Logger } from '../core/utils/logger.js';
import { NPCMonitor } from './monitors/npc-monitor.js';
import { QuestValidator } from './validators/quest-validator.js';
import { ScriptAnalyzer } from './analyzers/script-analyzer.js';
import { MetricsCollector } from './metrics/metrics-collector.js';

export class AIDebuggerServer {
  constructor(config) {
    this.config = config;
    this.logger = new Logger('AIDebugger');
    this.app = express();
    this.server = null;
    this.npcMonitor = new NPCMonitor();
    this.questValidator = new QuestValidator();
    this.scriptAnalyzer = new ScriptAnalyzer();
    this.metricsCollector = new MetricsCollector();
  }

  async start() {
    this.setupRoutes();

    return new Promise((resolve) => {
      this.server = this.app.listen(this.config.dashboardPort, () => {
        this.logger.info(`AI Debugger dashboard started on port ${this.config.dashboardPort}`);
        
        // Start monitoring
        if (this.config.enableNpcTracking) {
          this.npcMonitor.start();
        }
        if (this.config.enableQuestValidation) {
          this.questValidator.start();
        }
        if (this.config.enableScriptAnalysis) {
          this.scriptAnalyzer.start();
        }

        this.metricsCollector.start(this.config.metricsInterval);
        
        resolve();
      });
    });
  }

  setupRoutes() {
    this.app.use(express.json());
    // Serve static files if public directory exists
    // this.app.use(express.static('src/ai-debugger/dashboard/public'));

    // Dashboard home
    this.app.get('/debugger', (req, res) => {
      res.send(this.getDashboardHTML());
    });

    // API endpoints
    this.app.get('/api/debugger/status', (req, res) => {
      res.json({
        status: 'online',
        uptime: process.uptime(),
        monitors: {
          npc: this.npcMonitor.getStatus(),
          quest: this.questValidator.getStatus(),
          script: this.scriptAnalyzer.getStatus()
        }
      });
    });

    this.app.get('/api/debugger/metrics', (req, res) => {
      res.json(this.metricsCollector.getMetrics());
    });

    this.app.get('/api/debugger/npcs', (req, res) => {
      res.json(this.npcMonitor.getTrackedNPCs());
    });

    this.app.get('/api/debugger/quests/errors', (req, res) => {
      res.json(this.questValidator.getErrors());
    });

    this.app.get('/api/debugger/scripts/issues', (req, res) => {
      res.json(this.scriptAnalyzer.getIssues());
    });

    this.app.get('/api/debugger/logs', (req, res) => {
      const { level, limit = 100 } = req.query;
      res.json(this.metricsCollector.getLogs(level, parseInt(limit)));
    });
  }

  getDashboardHTML() {
    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Trinity Studio - AI Debugger</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%);
            color: #fff;
            padding: 20px;
        }
        .container { max-width: 1400px; margin: 0 auto; }
        header { text-align: center; margin-bottom: 40px; }
        h1 { font-size: 2.5rem; margin-bottom: 10px; }
        .subtitle { opacity: 0.8; }
        .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px; margin-bottom: 30px; }
        .card { 
            background: rgba(255, 255, 255, 0.1);
            border-radius: 10px;
            padding: 20px;
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.2);
        }
        .card h2 { font-size: 1.3rem; margin-bottom: 15px; }
        .metric { font-size: 2rem; font-weight: bold; margin: 10px 0; }
        .status { 
            display: inline-block;
            padding: 5px 15px;
            border-radius: 20px;
            font-size: 0.9rem;
            font-weight: bold;
        }
        .status.online { background: #4CAF50; }
        .status.offline { background: #f44336; }
        .log-entry { 
            padding: 8px;
            margin: 5px 0;
            background: rgba(0, 0, 0, 0.2);
            border-radius: 5px;
            font-family: monospace;
            font-size: 0.9rem;
        }
        .log-error { border-left: 3px solid #f44336; }
        .log-warning { border-left: 3px solid #ff9800; }
        .log-info { border-left: 3px solid #2196F3; }
        .refresh-btn {
            background: rgba(255, 255, 255, 0.2);
            border: none;
            padding: 10px 20px;
            border-radius: 5px;
            color: white;
            cursor: pointer;
            font-size: 1rem;
            margin: 10px 5px;
        }
        .refresh-btn:hover { background: rgba(255, 255, 255, 0.3); }
    </style>
</head>
<body>
    <div class="container">
        <header>
            <h1>🔍 Trinity Studio AI Debugger</h1>
            <p class="subtitle">Real-time Monitoring & Analysis Dashboard</p>
        </header>

        <div id="status-bar" style="text-align: center; margin-bottom: 30px;">
            <span class="status online">System Online</span>
            <span style="margin: 0 20px;">Uptime: <span id="uptime">0s</span></span>
        </div>

        <div style="text-align: center; margin-bottom: 20px;">
            <button class="refresh-btn" onclick="refreshData()">🔄 Refresh All</button>
            <button class="refresh-btn" onclick="toggleAutoRefresh()">⏯️ Auto-Refresh: <span id="auto-status">ON</span></button>
        </div>

        <div class="grid">
            <div class="card">
                <h2>📊 Server Metrics</h2>
                <div id="metrics">Loading...</div>
            </div>

            <div class="card">
                <h2>🤖 NPC Monitor</h2>
                <div id="npc-status">Loading...</div>
            </div>

            <div class="card">
                <h2>📜 Quest Validator</h2>
                <div id="quest-status">Loading...</div>
            </div>

            <div class="card">
                <h2>📝 Script Analyzer</h2>
                <div id="script-status">Loading...</div>
            </div>
        </div>

        <div class="card">
            <h2>📋 Recent Logs</h2>
            <div id="logs">Loading...</div>
        </div>
    </div>

    <script>
        let autoRefresh = true;
        let refreshInterval;

        async function fetchData(endpoint) {
            try {
                const response = await fetch(endpoint);
                return await response.json();
            } catch (error) {
                console.error('Fetch error:', error);
                return null;
            }
        }

        async function updateMetrics() {
            const metrics = await fetchData('/api/debugger/metrics');
            if (metrics) {
                document.getElementById('metrics').innerHTML = \`
                    <div class="metric">\${metrics.activePlayers || 0}</div>
                    <div>Active Players</div>
                    <div style="margin-top: 15px;">CPU: \${metrics.cpuUsage || 0}%</div>
                    <div>Memory: \${metrics.memoryUsage || 0}MB</div>
                \`;
            }
        }

        async function updateStatus() {
            const status = await fetchData('/api/debugger/status');
            if (status) {
                document.getElementById('uptime').textContent = Math.floor(status.uptime) + 's';
                document.getElementById('npc-status').innerHTML = \`
                    <div>Active NPCs: <strong>\${status.monitors.npc.activeNPCs || 0}</strong></div>
                    <div>Errors: <strong>\${status.monitors.npc.errors || 0}</strong></div>
                \`;
                document.getElementById('quest-status').innerHTML = \`
                    <div>Validated: <strong>\${status.monitors.quest.validated || 0}</strong></div>
                    <div>Errors: <strong>\${status.monitors.quest.errors || 0}</strong></div>
                \`;
                document.getElementById('script-status').innerHTML = \`
                    <div>Analyzed: <strong>\${status.monitors.script.analyzed || 0}</strong></div>
                    <div>Issues: <strong>\${status.monitors.script.issues || 0}</strong></div>
                \`;
            }
        }

        async function updateLogs() {
            const logs = await fetchData('/api/debugger/logs?limit=20');
            if (logs && logs.length > 0) {
                document.getElementById('logs').innerHTML = logs.map(log => \`
                    <div class="log-entry log-\${log.level}">
                        [\${new Date(log.timestamp).toLocaleTimeString()}] \${log.message}
                    </div>
                \`).join('');
            } else {
                document.getElementById('logs').innerHTML = '<div style="opacity: 0.6;">No recent logs</div>';
            }
        }

        function refreshData() {
            updateMetrics();
            updateStatus();
            updateLogs();
        }

        function toggleAutoRefresh() {
            autoRefresh = !autoRefresh;
            document.getElementById('auto-status').textContent = autoRefresh ? 'ON' : 'OFF';
            if (autoRefresh) {
                startAutoRefresh();
            } else {
                clearInterval(refreshInterval);
            }
        }

        function startAutoRefresh() {
            refreshInterval = setInterval(refreshData, 5000);
        }

        // Initial load
        refreshData();
        startAutoRefresh();
    </script>
</body>
</html>
    `;
  }

  async stop() {
    this.npcMonitor.stop();
    this.questValidator.stop();
    this.scriptAnalyzer.stop();
    this.metricsCollector.stop();

    if (this.server) {
      return new Promise((resolve) => {
        this.server.close(() => {
          this.logger.info('AI Debugger server stopped');
          resolve();
        });
      });
    }
  }
}
