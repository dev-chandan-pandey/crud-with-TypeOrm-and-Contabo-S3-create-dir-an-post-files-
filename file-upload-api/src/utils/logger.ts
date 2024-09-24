import { createLogger, format, transports } from 'winston';

const { combine, timestamp, printf } = format;

// Define custom log format
const customFormat = printf(({ level, message, timestamp }) => {
  return `${timestamp} [${level.toUpperCase()}]: ${message}`;
});

// Create logger instance
const logger = createLogger({
  format: combine(
    timestamp(),
    customFormat
  ),
  transports: [
    new transports.Console(), // Logs to console
    new transports.File({ filename: 'logs/error.log', level: 'error' }), // Logs errors to a file
    new transports.File({ filename: 'logs/combined.log' }) // Logs everything to a combined file
  ],
});

export default logger;
