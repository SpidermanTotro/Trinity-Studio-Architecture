#!/usr/bin/env node

/**
 * Sync Character to Online Mode
 */

import { SyncManager } from './sync-manager.js';
import { ConfigManager } from '../core/config/config-manager.js';
import { Logger } from '../core/utils/logger.js';

const logger = new Logger('SyncToOnline');

async function main() {
  const args = process.argv.slice(2);
  const characterArg = args.find(arg => arg.startsWith('--character='));

  if (!characterArg) {
    console.error('Usage: npm run sync:to-online -- --character=CharacterName');
    process.exit(1);
  }

  const characterName = characterArg.split('=')[1];

  try {
    logger.info(`Starting sync to online for character: ${characterName}`);

    const config = await ConfigManager.load();
    const syncManager = new SyncManager(config);

    // In real implementation, would look up character ID by name
    const characterId = 1;

    const transferPackage = await syncManager.syncCharacterToOnline(characterId);

    // Save transfer package to file
    const fs = await import('fs/promises');
    const filename = `character_${characterName}_${Date.now()}.transfer`;
    await fs.writeFile(filename, JSON.stringify(transferPackage, null, 2));

    logger.info(`Transfer package saved to: ${filename}`);
    logger.info('Upload this file to your online server to complete the transfer');

    console.log('\nSync to online completed successfully!');
    console.log(`Transfer file: ${filename}`);
  } catch (error) {
    logger.error('Sync to online failed:', error);
    process.exit(1);
  }
}

main();
