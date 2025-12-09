#!/usr/bin/env node

/**
 * Database Initialization Script
 * Creates necessary databases and imports base schema
 */

import { Logger } from '../../src/core/utils/logger.js';
import mysql from 'mysql2/promise';

const logger = new Logger('DB-Init');

async function createDatabases() {
  logger.info('Creating databases...');

  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || ''
  });

  const databases = [
    'trinity_auth',
    'trinity_characters',
    'trinity_world'
  ];

  for (const db of databases) {
    try {
      await connection.query(`CREATE DATABASE IF NOT EXISTS ${db}`);
      logger.info(`Created database: ${db}`);
    } catch (error) {
      logger.error(`Failed to create ${db}:`, error.message);
    }
  }

  await connection.end();
  logger.info('Database creation complete');
}

async function main() {
  try {
    await createDatabases();
    logger.info('Database initialization complete!');
  } catch (error) {
    logger.error('Database initialization failed:', error);
    process.exit(1);
  }
}

main();
