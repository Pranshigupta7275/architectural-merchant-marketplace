import winston from 'winston';
import morgan from 'morgan';
import path from 'path';

// Define log format
const logFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.errors({ stack: true }),
  winston.format.splat(),
  winston.format.json()
);

/**
 * Winston Logger Instance
 * Configures file transports for production and console transport for development.
 */
export const logger = winston.createLogger({
  level: process.env.NODE_ENV === 'development' ? 'debug' : 'info',
  format: logFormat,
  defaultMeta: { service: 'saas-api' },
  transports: [
    // Write all logs with importance level of `error` or higher to `error.log`
    new winston.transports.File({ 
      filename: path.join(process.cwd(), 'logs', 'error.log'), 
      level: 'error' 
    }),
    // Write all logs with importance level of `info` or higher to `combined.log`
    new winston.transports.File({ 
      filename: path.join(process.cwd(), 'logs', 'combined.log') 
    }),
  ],
});

// If we're not in production, log to the `console` with a simpler format
if (process.env.NODE_ENV !== 'production') {
  logger.add(
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.printf(
          (info) => `${info.timestamp} ${info.level}: ${info.message}`
        )
      ),
    })
  );
}

/**
 * Morgan Middleware Integration
 * Intercepts HTTP requests and logs them via Winston.
 */
const morganFormat = process.env.NODE_ENV === 'production' ? 'combined' : 'dev';

export const requestLogger = morgan(morganFormat, {
  stream: {
    write: (message) => {
      // Remove newline character appended by morgan
      logger.info(message.trim());
    },
  },
});