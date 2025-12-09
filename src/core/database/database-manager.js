import mysql from 'mysql2/promise';
import { Logger } from '../utils/logger.js';

export class DatabaseManager {
  constructor(config) {
    this.config = config;
    this.pools = {};
    this.logger = new Logger('DatabaseManager');
  }

  async connect() {
    try {
      // Create connection pools for each database
      this.pools.auth = mysql.createPool({
        host: this.config.host,
        port: this.config.port,
        user: this.config.user,
        password: this.config.password,
        database: this.config.auth,
        connectionLimit: this.config.connectionLimit,
        waitForConnections: this.config.waitForConnections,
        queueLimit: this.config.queueLimit
      });

      this.pools.characters = mysql.createPool({
        host: this.config.host,
        port: this.config.port,
        user: this.config.user,
        password: this.config.password,
        database: this.config.characters,
        connectionLimit: this.config.connectionLimit,
        waitForConnections: this.config.waitForConnections,
        queueLimit: this.config.queueLimit
      });

      this.pools.world = mysql.createPool({
        host: this.config.host,
        port: this.config.port,
        user: this.config.user,
        password: this.config.password,
        database: this.config.world,
        connectionLimit: this.config.connectionLimit,
        waitForConnections: this.config.waitForConnections,
        queueLimit: this.config.queueLimit
      });

      // Test connections
      await this.pools.auth.query('SELECT 1');
      await this.pools.characters.query('SELECT 1');
      await this.pools.world.query('SELECT 1');

      return true;
    } catch (error) {
      this.logger.error('Database connection failed:', error.message);
      // Don't throw in development mode - allow server to start without DB
      if (process.env.NODE_ENV === 'production') {
        throw error;
      }
      this.logger.warn('⚠️  Running without database connection (development mode)');
      return false;
    }
  }

  async disconnect() {
    const promises = [];
    if (this.pools.auth) promises.push(this.pools.auth.end());
    if (this.pools.characters) promises.push(this.pools.characters.end());
    if (this.pools.world) promises.push(this.pools.world.end());
    await Promise.all(promises);
  }

  getPool(database = 'world') {
    return this.pools[database];
  }

  async query(sql, params, database = 'world') {
    const pool = this.getPool(database);
    if (!pool) {
      throw new Error(`Database pool not found: ${database}`);
    }
    const [results] = await pool.query(sql, params);
    return results;
  }

  async execute(sql, params, database = 'world') {
    const pool = this.getPool(database);
    if (!pool) {
      throw new Error(`Database pool not found: ${database}`);
    }
    const [results] = await pool.execute(sql, params);
    return results;
  }
}
