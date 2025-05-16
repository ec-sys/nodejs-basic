const Redis = require('redis');

const redisClient = Redis.createClient({
    url: process.env.REDIS_URL || 'redis://localhost:6379'
});

const initializeRedis = async () => {
    try {
        // Set up event handlers
        redisClient.on('error', (err) => {
            console.error('Redis Client Error:', err);
        });

        redisClient.on('connect', () => {
            console.log('Redis Client Connected');
        });

        redisClient.on('reconnecting', () => {
            console.log('Redis Client Reconnecting');
        });
        await redisClient.connect();
    } catch (err) {
        console.error('Failed to connect to Redis:', err);
    }
};

module.exports = {redisClient, initializeRedis};