import fs from 'fs/promises';
import path from 'path';
import chokidar from 'chokidar';
import { Logger } from '../core/utils/logger.js';

export class LiveReloadServer {
  constructor(config) {
    this.config = config;
    this.logger = new Logger('LiveReload');
    this.watcher = null;
    this.scriptCache = new Map();
  }

  async start() {
    if (!this.config.enabled) {
      this.logger.info('Live reload is disabled');
      return;
    }

    this.logger.info('Starting live reload server...');

    // Watch for file changes
    this.watcher = chokidar.watch(this.config.watchDirectories, {
      ignored: /(^|[\/\\])\../, // ignore dotfiles
      persistent: true,
      ignoreInitial: true
    });

    this.watcher
      .on('change', (filePath) => this.handleFileChange(filePath))
      .on('add', (filePath) => this.handleFileAdd(filePath))
      .on('unlink', (filePath) => this.handleFileRemove(filePath));

    this.logger.info(`Watching directories: ${this.config.watchDirectories.join(', ')}`);
  }

  async handleFileChange(filePath) {
    this.logger.info(`File changed: ${filePath}`);
    
    // Debounce
    setTimeout(async () => {
      try {
        await this.reloadFile(filePath);
        this.logger.info(`Successfully reloaded: ${filePath}`);
      } catch (error) {
        this.logger.error(`Failed to reload ${filePath}:`, error.message);
      }
    }, this.config.debounceMs);
  }

  handleFileAdd(filePath) {
    this.logger.debug(`File added: ${filePath}`);
  }

  handleFileRemove(filePath) {
    this.logger.debug(`File removed: ${filePath}`);
    this.scriptCache.delete(filePath);
  }

  async reloadFile(filePath) {
    const ext = path.extname(filePath);
    
    if (ext === '.js' || ext === '.mjs') {
      // For ES modules, we need to append a cache-busting query
      const modulePath = `${filePath}?update=${Date.now()}`;
      delete require.cache[require.resolve(filePath)];
      await import(modulePath);
    }
  }

  async reloadScript(scriptId) {
    this.logger.info(`Manual reload requested for script: ${scriptId}`);
    
    // Implementation would reload specific script from database or file system
    // This is a placeholder for the actual implementation
    return { success: true, scriptId, timestamp: new Date() };
  }

  async stop() {
    if (this.watcher) {
      await this.watcher.close();
      this.logger.info('Live reload server stopped');
    }
  }
}
