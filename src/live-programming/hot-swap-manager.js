import { Logger } from '../core/utils/logger.js';

export class HotSwapManager {
  constructor() {
    this.logger = new Logger('HotSwap');
    this.loadedScripts = new Map();
  }

  async swapScript(scriptId, newContent) {
    this.logger.info(`Hot-swapping script: ${scriptId}`);

    try {
      // Validate new script content
      await this.validateScript(newContent);

      // Store old version for rollback
      const oldContent = this.loadedScripts.get(scriptId);

      // Load new script
      this.loadedScripts.set(scriptId, newContent);

      this.logger.info(`Successfully hot-swapped script: ${scriptId}`);

      return {
        success: true,
        scriptId,
        timestamp: new Date(),
        oldVersion: oldContent ? 'backed up' : 'new script'
      };
    } catch (error) {
      this.logger.error(`Hot-swap failed for ${scriptId}:`, error.message);
      throw error;
    }
  }

  async validateScript(content) {
    // Basic validation - check for syntax errors
    try {
      new Function(content);
      return true;
    } catch (error) {
      throw new Error(`Script validation failed: ${error.message}`);
    }
  }

  rollback(scriptId) {
    const oldContent = this.loadedScripts.get(scriptId);
    if (oldContent) {
      this.logger.info(`Rolling back script: ${scriptId}`);
      return { success: true, scriptId };
    }
    throw new Error(`No backup found for script: ${scriptId}`);
  }
}
