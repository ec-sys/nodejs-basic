const { logToElastic } = require('../utils/logger');
const { v4: uuidv4 } = require('uuid');

// Middleware to log API requests and responses
const apiLogger = (req, res, next) => {
    // Generate a unique request ID
    const requestId = uuidv4();
    req.requestId = requestId;

    // Record start time
    const startTime = Date.now();

    // Record original end function
    const originalEnd = res.end;

    // Override end function
    res.end = function(chunk, encoding) {
        // Calculate response time
        const responseTime = Date.now() - startTime;

        // Restore original end function
        res.end = originalEnd;

        // Call original end function
        res.end(chunk, encoding);

        // Prepare log data
        const logData = {
            requestId,
            method: req.method,
            url: req.originalUrl,
            status: res.statusCode,
            responseTime,
            userId: req.user ? req.user.id : 'unauthenticated',
            userAgent: req.headers['user-agent'],
            ip: req.ip,
            message: `${req.method} ${req.originalUrl} ${res.statusCode} ${responseTime}ms`
        };

        // Log to Elasticsearch
        logToElastic(logData);
    };

    next();
};

module.exports = { apiLogger };