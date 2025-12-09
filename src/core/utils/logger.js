import winston from 'winston';
import path from 'path';
import fs from 'fs';

const logDir = path.join(process.cwd(), 'logs');

// Create logs directory if it doesn't exist
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
}

export class Logger {
  constructor(category = 'App') {
    this.category = category;
    this.logger = winston.createLogger({
      level: process.env.LOG_LEVEL || 'info',
      format: winston.format.combine(
        winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        winston.format.errors({ stack: true }),
        winston.format.splat(),
        winston.format.json()
      ),
      defaultMeta: { service: category },
      transports: [
        // Write all logs to combined.log
        new winston.transports.File({ 
          filename: path.join(logDir, 'combined.log'),
          maxsize: 20 * 1024 * 1024, // 20MB
          maxFiles: 30
        }),
        // Write errors to error.log
        new winston.transports.File({ 
          filename: path.join(logDir, 'error.log'), 
          level: 'error',
          maxsize: 20 * 1024 * 1024,
          maxFiles: 30
        })
      ]
    });

    // Also log to console in non-production
    if (process.env.NODE_ENV !== 'production') {
      this.logger.add(new winston.transports.Console({
        format: winston.format.combine(
          winston.format.colorize(),
          winston.format.simple(),
          winston.format.printf(({ level, message, timestamp, ...meta }) => {
            const metaStr = Object.keys(meta).length ? JSON.stringify(meta) : '';
            return `${timestamp} [${category}] ${level}: ${message} ${metaStr}`;
          })
        )
      }));
    }
  }

  info(message, ...args) {
    this.logger.info(message, ...args);
  }

  error(message, ...args) {
    this.logger.error(message, ...args);
  }

  warn(message, ...args) {
    this.logger.warn(message, ...args);
  }

  debug(message, ...args) {
    this.logger.debug(message, ...args);
  }

  verbose(message, ...args) {
    this.logger.verbose(message, ...args);
  }
}
