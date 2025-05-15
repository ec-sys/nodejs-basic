const winston = require('winston');
const { ElasticsearchTransport } = require('winston-elasticsearch');
const path = require('path');
const fs = require('fs');

// Ensure logs directory exists
const logDir = 'logs';
if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir);
}

// Define log format
const logFormat = winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.errors({ stack: true }),
    winston.format.json()
);

// Create transports array
const transports = [
    new winston.transports.Console({
        format: winston.format.combine(
            winston.format.colorize(),
            winston.format.simple()
        ),
    }),
    new winston.transports.File({ filename: path.join(logDir, 'error.log'), level: 'error' }),
    new winston.transports.File({ filename: path.join(logDir, 'combined.log') })
];

// Add Elasticsearch transport only if ELASTICSEARCH_NODE is defined
if (process.env.ELASTICSEARCH_NODE) {
    try {
        const esTransportOpts = {
            level: 'info',
            clientOpts: { node: process.env.ELASTICSEARCH_NODE },
            indexPrefix: 'api-logs',
        };
        transports.push(new ElasticsearchTransport(esTransportOpts));
    } catch (error) {
        console.error('Failed to initialize Elasticsearch transport:', error);
    }
}

// Create logger
const logger = winston.createLogger({
    level: process.env.LOG_LEVEL || 'info',
    format: logFormat,
    defaultMeta: { service: 'api-service' },
    transports,
    exitOnError: false
});

// Create a fallback logger in case of errors
const createFallbackLogger = () => {
    return {
        error: (message, meta) => console.error(`ERROR: ${message}`, meta),
        warn: (message, meta) => console.warn(`WARN: ${message}`, meta),
        info: (message, meta) => console.info(`INFO: ${message}`, meta),
        debug: (message, meta) => console.debug(`DEBUG: ${message}`, meta)
    };
};

// Log unhandled rejections
process.on('unhandledRejection', (reason, promise) => {
    logger.error('Unhandled Rejection', { reason, promise });
});

// Export logger with fallback
module.exports = logger || createFallbackLogger();



// const { createLogger, format, transports } = require('winston');
// const { ElasticsearchTransport } = require('winston-elasticsearch');
//
// // Elasticsearch options
// const esTransportOpts = {
//     level: 'info',
//     clientOpts: {
//         node: process.env.ELASTICSEARCH_HOST || 'http://localhost:9200'
//     },
//     indexPrefix: 'api-logs'
// };
//
// // Create Winston logger
// const logger = createLogger({
//     level: 'info',
//     format: format.combine(
//         format.timestamp({
//             format: 'YYYY-MM-DD HH:mm:ss'
//         }),
//         format.errors({ stack: true }),
//         format.splat(),
//         format.json()
//     ),
//     defaultMeta: { service: 'api' },
//     transports: [
//         new transports.Console({
//             format: format.combine(
//                 format.colorize(),
//                 format.simple()
//             )
//         }),
//         new ElasticsearchTransport(esTransportOpts)
//     ]
// });
//
// module.exports = logger;


// const { createLogger, format, transports } = require('winston');
// require('dotenv').config();
//
// const logger = createLogger({
//     level: process.env.LOG_LEVEL || 'info',
//     format: format.combine(
//         format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
//         format.errors({ stack: true }), // log error stack
//         format.splat(),
//         format.json()
//     ),
//     transports: [
//         new transports.Console({
//             format: format.combine(
//                 format.colorize(),
//                 format.printf(({ level, message, timestamp, stack }) => {
//                     return `${timestamp} [${level}]: ${stack || message}`;
//                 })
//             )
//         }),
//         new transports.File({ filename: 'logs/error.log', level: 'error' }),
//         new transports.File({ filename: 'logs/combined.log' }),
//     ],
//     exitOnError: false,
// });
//
// module.exports = logger;

// const winston = require('winston');
//
// const logger = winston.createLogger({
//     level: 'info',
//     format: winston.format.json(),
//     defaultMeta: { service: 'user-service' },
//     transports: [
//         //
//         // - Write all logs with importance level of `error` or higher to `error.log`
//         //   (i.e., error, fatal, but not other levels)
//         //
//         new winston.transports.File({ filename: 'error.log', level: 'error' }),
//         //
//         // - Write all logs with importance level of `info` or higher to `combined.log`
//         //   (i.e., fatal, error, warn, and info, but not trace)
//         //
//         new winston.transports.File({ filename: 'combined.log' }),
//     ],
// });
//
// //
// // If we're not in production then log to the `console` with the format:
// // `${info.level}: ${info.message} JSON.stringify({ ...rest }) `
// //
// if (process.env.NODE_ENV !== 'production') {
//     logger.add(new winston.transports.Console({
//         format: winston.format.simple(),
//     }));
// }
//
// module.exports = logger;