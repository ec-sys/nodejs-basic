const authService = require('../services/auth-service');
const commonUtil = require("../utils/common-util");
const jwt = require("jsonwebtoken");
const {redisClient} = require("../configs/redis-config");
const {ACCESS_TOKEN, REFRESH_TOKEN} = require("../constants/common-constant");

const logger = require('../utils/logger');

exports.login = async (req, res) => {
    try {
        const {email, password} = req.body;
        // Create token
        const token = await authService.login(email, password);

        res.status(200).json({
            success: true,
            token,
        });
    } catch (err) {
        res.status(400).json({
            success: false,
            message: err.message,
        });
    }
};

exports.logout = async (req, res) => {
    try {
        const accessToken = commonUtil.getTokenFromRequest(req);
        const { refreshToken } = req.body;

        // Ensure both tokens are provided
        if (!accessToken || !refreshToken) {
            return res.status(400).json({ message: 'Both access token and refresh token are required' });
        }

        // Decode both tokens
        const accessDecoded = jwt.decode(accessToken);
        const refreshDecoded = jwt.decode(refreshToken);

        if (!accessDecoded.jti || !refreshDecoded.jti) {
            return res.status(401).json({ message: 'Invalid tokens' });
        }

        // Verify tokens belong to same user
        if (accessDecoded.user.id !== refreshDecoded.user.id) {
            return res.status(401).json({ message: 'Tokens do not match' });
        }

        // Delete tokens from Redis
        await Promise.all([
            redisClient.del(`${ACCESS_TOKEN}:${accessDecoded.jti}`),
            redisClient.del(`${REFRESH_TOKEN}:${refreshDecoded.jti}`)
        ]);

        res.status(200).json({
            success: true,
            message: 'Logged out successfully',
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: 'Failed to log out',
        });
        logger.error(err);
    }
};

exports.refreshToken = async (req, res) => {
    try {
        const accessToken = commonUtil.getTokenFromRequest(req);
        const { refreshToken } = req.body;

        // Ensure both tokens are provided
        if (!accessToken || !refreshToken) {
            return res.status(400).json({ message: 'Both access token and refresh token are required' });
        }

        // Decode both tokens
        const accessDecoded = jwt.decode(accessToken);
        const refreshDecoded = jwt.decode(refreshToken);

        if (!accessDecoded.jti || !refreshDecoded.jti) {
            return res.status(401).json({ message: 'Invalid tokens' });
        }

        // Verify tokens belong to same user
        if (accessDecoded.user.id !== refreshDecoded.user.id) {
            return res.status(401).json({ message: 'Tokens do not match' });
        }

        // Check if the refresh token exists in Redis
        const userId = await redisClient.get(`${REFRESH_TOKEN}:${refreshDecoded.jti}`);
        if (!userId) {
            return res.status(401).json({ message: 'Refresh token is invalid or expired' });
        }

        // Delete both old tokens from Redis
        await Promise.all([
            redisClient.del(`${ACCESS_TOKEN}:${accessDecoded.jti}`),
            redisClient.del(`${REFRESH_TOKEN}:${refreshDecoded.jti}`)
        ]);

        // Generate new tokens
        const user = await authService.refreshToken(userId);

        res.status(200).json({
            success: true,
            token: user,
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: 'Failed to refresh token',
        });
        logger.error(err);
    }
};

exports.validateAccessToken = async (req, res) => {
    try {
        const accessToken = commonUtil.getTokenFromRequest(req);

        // Ensure the access token is provided
        if (!accessToken) {
            return res.status(400).json({ message: 'Access token is required' });
        }

        // Decode the access token
        const decoded = jwt.decode(accessToken);

        // Check if the token is valid and contains a `jti`
        if (!decoded || !decoded.jti) {
            return res.status(401).json({ message: 'Invalid access token' });
        }

        // Check if the access token exists in Redis
        const tokenExists = await redisClient.get(`${ACCESS_TOKEN}:${decoded.jti}`);
        if (!tokenExists) {
            return res.status(401).json({ message: 'Access token is invalid or expired' });
        }

        res.status(200).json({
            success: true,
            message: 'Access token is valid',
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: 'Failed to validate access token',
        });
        logger.error(err);
    }
};

exports.validateRefreshToken = async (req, res) => {
    try {
        const refreshToken = req.body.refreshToken;

        // Ensure the refresh token is provided
        if (!refreshToken) {
            return res.status(400).json({ message: 'Refresh token is required' });
        }

        // Decode the refresh token
        const decoded = jwt.decode(refreshToken);

        // Check if the token is valid and contains a `jti`
        if (!decoded || !decoded.jti) {
            return res.status(401).json({ message: 'Invalid refresh token' });
        }

        // Check if the refresh token exists in Redis
        const tokenExists = await redisClient.get(`${REFRESH_TOKEN}:${decoded.jti}`);
        if (!tokenExists) {
            return res.status(401).json({ message: 'Refresh token is invalid or expired' });
        }

        res.status(200).json({
            success: true,
            message: 'Refresh token is valid',
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: 'Failed to validate refresh token',
        });
        logger.error(err);
    }
};