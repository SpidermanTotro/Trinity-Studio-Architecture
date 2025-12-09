#!/usr/bin/env node

/**
 * Sync Character to Offline Mode
 */

import { SyncManager } from './sync-manager.js';
import { ConfigManager } from '../core/config/config-manager.js';
import { Logger } from '../core/utils/logger.js';

const logger = new Logger('SyncToOffline');

async function main() {
  const args = process.argv.slice(2);
  const fileArg = args.find(arg => arg.startsWith('--file='));

  if (!fileArg) {
    console.error('Usage: npm run sync:to-offline -- --file=transfer_file.transfer');
    process.exit(1);
  }

  const filename = fileArg.split('=')[1];

  try {
    logger.info(`Starting sync to offline from file: ${filename}`);

    const config = await ConfigManager.load();
    const syncManager = new SyncManager(config);

    // Read transfer package
    const fs = await import('fs/promises');
    const transferData = await fs.readFile(filename, 'utf-8');
    const transferPackage = JSON.parse(transferData);

    const result = await syncManager.syncCharacterToOffline(transferPackage);

    logger.info(`Character imported successfully: ${result.characterId}`);
    console.log('\nSync to offline completed successfully!');
  } catch (error) {
    logger.error('Sync to offline failed:', error);
    process.exit(1);
  }
}

main();
