#!/usr/bin/env node

/**
 * Expansion Configuration Script
 * Interactive tool for enabling/disabling expansions
 */

import { ConfigManager } from '../src/core/config/config-manager.js';
import readline from 'readline';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(query) {
  return new Promise((resolve) => {
    rl.question(query, resolve);
  });
}

async function main() {
  console.log('=== Trinity Studio Architecture - Expansion Configuration ===\n');

  const config = await ConfigManager.load();
  const expansions = Object.keys(config.expansions);

  console.log('Current expansion status:');
  expansions.forEach((exp) => {
    const status = config.expansions[exp] ? '✓ Enabled' : '✗ Disabled';
    console.log(`  ${exp}: ${status}`);
  });

  console.log('\nEnter expansion names to toggle (comma-separated), or "all" to toggle all:');
  const input = await question('> ');

  if (input.toLowerCase() === 'all') {
    const newState = !config.expansions[expansions[0]];
    expansions.forEach((exp) => {
      config.expansions[exp] = newState;
    });
  } else {
    const selected = input.split(',').map((s) => s.trim());
    selected.forEach((exp) => {
      if (config.expansions.hasOwnProperty(exp)) {
        config.expansions[exp] = !config.expansions[exp];
      } else {
        console.log(`Warning: Unknown expansion "${exp}"`);
      }
    });
  }

  await ConfigManager.save(config);

  console.log('\nUpdated expansion status:');
  expansions.forEach((exp) => {
    const status = config.expansions[exp] ? '✓ Enabled' : '✗ Disabled';
    console.log(`  ${exp}: ${status}`);
  });

  console.log('\nConfiguration saved! Restart the server to apply changes.');
  rl.close();
}

main();
