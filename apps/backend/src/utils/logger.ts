import winston from 'winston';
import { config } from '../config/config.js';

const logFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.errors({ stack: true }),
  winston.format.splat(),
  winston.format.json()
);

// Configure transports based on environment
const transports: winston.transport[] = [];

if (config.nodeEnv === 'production') {
  // In production (Vercel), use console only (no file system access)
  transports.push(
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.json()
      ),
    })
  );
} else {
  // In development, use file logging
  transports.push(
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' })
  );
  
  // Also add console in development with colorized output
  transports.push(
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      ),
    })
  );
}

export const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: logFormat,
  defaultMeta: { service: 'myfamilylink-backend' },
  transports,
});
