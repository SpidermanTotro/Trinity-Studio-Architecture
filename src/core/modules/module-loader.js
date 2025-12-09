import fs from 'fs/promises';
import path from 'path';
import { Logger } from '../utils/logger.js';

export class ModuleLoader {
  constructor(config) {
    this.config = config;
    this.logger = new Logger('ModuleLoader');
    this.modules = new Map();
    this.loadedExpansions = [];
  }

  async loadModules() {
    this.logger.info('Loading expansion modules...');

    const expansionsDir = path.join(process.cwd(), 'src', 'expansions');
    
    for (const [expansionName, enabled] of Object.entries(this.config.expansions)) {
      if (enabled) {
        try {
          await this.loadExpansion(expansionName, expansionsDir);
          this.loadedExpansions.push(expansionName);
        } catch (error) {
          this.logger.error(`Failed to load expansion ${expansionName}:`, error.message);
        }
      }
    }

    this.logger.info(`Loaded ${this.loadedExpansions.length} expansion modules: ${this.loadedExpansions.join(', ')}`);
  }

  async loadExpansion(name, baseDir) {
    const expansionDir = path.join(baseDir, name);
    const modulePath = path.join(expansionDir, 'index.js');

    try {
      // Check if module file exists
      await fs.access(modulePath);
      
      // Import the module
      const module = await import(modulePath);
      
      // Store module reference
      this.modules.set(name, {
        name,
        module: module.default || module,
        loaded: true,
        config: this.config.expansionsData[name]
      });

      this.logger.debug(`Loaded expansion module: ${name}`);
    } catch (error) {
      // Module doesn't exist yet - that's okay for initial setup
      this.modules.set(name, {
        name,
        module: null,
        loaded: false,
        config: this.config.expansionsData[name]
      });
      this.logger.debug(`Expansion module ${name} not implemented yet`);
    }
  }

  getModule(name) {
    return this.modules.get(name);
  }

  getLoadedModules() {
    return this.loadedExpansions;
  }

  getModuleStatus() {
    const status = {};
    for (const [name, data] of this.modules.entries()) {
      status[name] = {
        loaded: data.loaded,
        version: data.config?.version,
        name: data.config?.name
      };
    }
    return status;
  }

  async toggleModule(name) {
    const module = this.modules.get(name);
    if (!module) {
      throw new Error(`Module ${name} not found`);
    }

    // Update configuration
    this.config.expansions[name] = !this.config.expansions[name];
    
    // In a full implementation, this would reload the module
    this.logger.info(`Toggled module ${name} to ${this.config.expansions[name]}`);

    return {
      name,
      enabled: this.config.expansions[name]
    };
  }
}
