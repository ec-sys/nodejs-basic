const logger = require('../utils/logger');

const loggerMiddleware = (req, res, next) => {
    // Original URL path
    const path = req.originalUrl || req.url;

    // Start time of request
    const start = new Date();

    // When response is finished
    res.on('finish', () => {
        const duration = new Date() - start;

        // Log request details
        logger.info('API Request', {
            method: req.method,
            path,
            statusCode: res.statusCode,
            duration,
            ip: req.ip,
            userAgent: req.get('user-agent') || '',
            userId: req.user ? req.user.id : 'unauthenticated'
        });
    });

    next();
};

module.exports = { loggerMiddleware };