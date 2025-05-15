const { v4: uuidv4 } = require('uuid');
const { elasticClient } = require('../configs/elastic-config');

// Function to log API calls to Elasticsearch
const logToElastic = async (logData) => {
    try {
        await elasticClient.index({
            index: 'api_logs',
            body: {
                timestamp: new Date(),
                ...logData
            }
        });
    } catch (error) {
        console.error('Error logging to Elasticsearch:', error);
    }
};

// Custom logger for use in controllers and services
const logger = {
    info: async (message, context = {}) => {
        const logData = {
            level: 'info',
            message,
            context,
            requestId: context.requestId || uuidv4()
        };
        await logToElastic(logData);
        console.log(`[INFO] ${message}`, context);
    },

    error: async (message, error, context = {}) => {
        const logData = {
            level: 'error',
            message,
            error: error.toString(),
            stack: error.stack,
            context,
            requestId: context.requestId || uuidv4()
        };
        await logToElastic(logData);
        console.error(`[ERROR] ${message}`, error, context);
    },

    warn: async (message, context = {}) => {
        const logData = {
            level: 'warn',
            message,
            context,
            requestId: context.requestId || uuidv4()
        };
        await logToElastic(logData);
        console.warn(`[WARN] ${message}`, context);
    },

    debug: async (message, context = {}) => {
        // Only log debug in development
        if (process.env.NODE_ENV === 'development') {
            const logData = {
                level: 'debug',
                message,
                context,
                requestId: context.requestId || uuidv4()
            };
            await logToElastic(logData);
            console.debug(`[DEBUG] ${message}`, context);
        }
    }
};

module.exports = { logToElastic, logger };