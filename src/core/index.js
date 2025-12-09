import express from 'express';
import { createServer } from 'http';
import { WebSocketServer } from 'ws';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

import { ConfigManager } from './config/config-manager.js';
import { ModuleLoader } from './modules/module-loader.js';
import { DatabaseManager } from './database/database-manager.js';
import { Logger } from './utils/logger.js';
import { AIDebuggerServer } from '../ai-debugger/server.js';
import { LiveReloadServer } from '../live-programming/live-reload-server.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

class TrinityStudioServer {
  constructor() {
    this.config = null;
    this.app = express();
    this.server = null;
    this.wss = null;
    this.logger = new Logger('TrinityStudioServer');
    this.moduleLoader = null;
    this.dbManager = null;
    this.aiDebugger = null;
    this.liveReloadServer = null;
  }

  async initialize() {
    try {
      this.logger.info('🚀 Trinity Studio Architecture initializing...');

      // Load configuration
      this.config = await ConfigManager.load();
      this.logger.info(`📋 Configuration loaded (mode: ${this.config.server.mode})`);

      // Initialize database
      this.dbManager = new DatabaseManager(this.config.database);
      await this.dbManager.connect();
      this.logger.info('🗄️  Database connected');

      // Initialize module loader
      this.moduleLoader = new ModuleLoader(this.config);
      await this.moduleLoader.loadModules();
      this.logger.info('📦 Modules loaded');

      // Setup Express middleware
      this.setupMiddleware();

      // Setup routes
      this.setupRoutes();

      // Create HTTP server
      this.server = createServer(this.app);

      // Setup WebSocket server
      this.wss = new WebSocketServer({ server: this.server });
      this.setupWebSocket();

      // Initialize AI Debugger if enabled
      if (this.config.features.aiDebugger) {
        this.aiDebugger = new AIDebuggerServer(this.config.aiDebugger);
        await this.aiDebugger.start();
        this.logger.info(`🔍 AI Debugger started on port ${this.config.aiDebugger.dashboardPort}`);
      }

      // Initialize Live Reload if enabled
      if (this.config.features.liveReload) {
        this.liveReloadServer = new LiveReloadServer(this.config.liveReload);
        await this.liveReloadServer.start();
        this.logger.info('🔄 Live Reload server started');
      }

      this.logger.info('✅ Trinity Studio Architecture initialized successfully');
    } catch (error) {
      this.logger.error('Failed to initialize server:', error);
      throw error;
    }
  }

  setupMiddleware() {
    const express = await import('express');
    const cors = await import('cors');
    const helmet = await import('helmet');
    const compression = await import('compression');

    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(cors.default());
    this.app.use(helmet.default());
    this.app.use(compression.default());

    // Request logging
    this.app.use((req, res, next) => {
      this.logger.debug(`${req.method} ${req.path}`);
      next();
    });
  }

  setupRoutes() {
    // Health check
    this.app.get('/health', (req, res) => {
      res.json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        version: '1.0.0'
      });
    });

    // System info
    this.app.get('/api/info', (req, res) => {
      res.json({
        name: 'Trinity Studio Architecture',
        version: '1.0.0',
        mode: this.config.server.mode,
        expansions: this.moduleLoader.getLoadedModules(),
        features: this.config.features
      });
    });

    // Module management
    this.app.get('/api/modules', (req, res) => {
      res.json(this.moduleLoader.getModuleStatus());
    });

    this.app.post('/api/modules/:name/toggle', async (req, res) => {
      try {
        const { name } = req.params;
        const result = await this.moduleLoader.toggleModule(name);
        res.json(result);
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    });

    // Reload script endpoint (for live programming)
    this.app.post('/api/reload/script/:scriptId', async (req, res) => {
      try {
        if (this.liveReloadServer) {
          await this.liveReloadServer.reloadScript(req.params.scriptId);
          res.json({ success: true, message: 'Script reloaded' });
        } else {
          res.status(503).json({ error: 'Live reload not enabled' });
        }
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    });

    // 404 handler
    this.app.use((req, res) => {
      res.status(404).json({ error: 'Route not found' });
    });

    // Error handler
    this.app.use((err, req, res, next) => {
      this.logger.error('Express error:', err);
      res.status(500).json({ error: 'Internal server error' });
    });
  }

  setupWebSocket() {
    this.wss.on('connection', (ws) => {
      this.logger.debug('WebSocket client connected');

      ws.on('message', (message) => {
        try {
          const data = JSON.parse(message);
          this.handleWebSocketMessage(ws, data);
        } catch (error) {
          this.logger.error('WebSocket message error:', error);
        }
      });

      ws.on('close', () => {
        this.logger.debug('WebSocket client disconnected');
      });

      // Send welcome message
      ws.send(JSON.stringify({
        type: 'welcome',
        message: 'Connected to Trinity Studio Architecture',
        timestamp: new Date().toISOString()
      }));
    });
  }

  handleWebSocketMessage(ws, data) {
    const { type, payload } = data;

    switch (type) {
      case 'ping':
        ws.send(JSON.stringify({ type: 'pong', timestamp: new Date().toISOString() }));
        break;
      case 'subscribe':
        // Handle subscription logic
        this.logger.debug(`Client subscribed to: ${payload.channel}`);
        break;
      default:
        this.logger.warn(`Unknown WebSocket message type: ${type}`);
    }
  }

  async start() {
    await this.initialize();

    const port = this.config.server.port;
    const host = this.config.server.host;

    this.server.listen(port, host, () => {
      this.logger.info(`🌐 Trinity Studio Architecture listening on ${host}:${port}`);
      this.logger.info(`📖 API documentation available at http://${host}:${port}/api/info`);
      
      if (this.config.features.aiDebugger) {
        this.logger.info(`🔍 AI Debugger dashboard: http://${host}:${this.config.aiDebugger.dashboardPort}/debugger`);
      }

      this.logger.info('🎮 Server ready! Press Ctrl+C to stop.');
    });
  }

  async stop() {
    this.logger.info('🛑 Shutting down Trinity Studio Architecture...');

    if (this.liveReloadServer) {
      await this.liveReloadServer.stop();
    }

    if (this.aiDebugger) {
      await this.aiDebugger.stop();
    }

    if (this.wss) {
      this.wss.close();
    }

    if (this.server) {
      this.server.close();
    }

    if (this.dbManager) {
      await this.dbManager.disconnect();
    }

    this.logger.info('✅ Shutdown complete');
    process.exit(0);
  }
}

// Main execution
const server = new TrinityStudioServer();

// Graceful shutdown
process.on('SIGTERM', () => server.stop());
process.on('SIGINT', () => server.stop());

// Start server
server.start().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});

export default TrinityStudioServer;
