const authService = require('../services/auth-service');
const commonUtil = require("../utils/common-util");
const jwt = require("jsonwebtoken");
const {redisClient} = require("../configs/redis-config");
const {ACCESS_TOKEN, REFRESH_TOKEN} = require("../constants/common-constant");

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
    let accessToken = commonUtil.getTokenFromRequest(req);
    // Make sure token exists
    if(!accessToken) {
        return res.status(404).json({message: 'Access token not found'});
    }
    try {
        const accessDecoded = jwt.decode(accessToken);
        if (!accessDecoded || !accessDecoded.jti) {
            return res.status(401).json({message: 'Invalid access token'});
        };

        // Validate refresh token if exist
        const { refreshToken } = req.body;
        let refreshJti;
        if(refreshToken) {
            const refreshDecoded = jwt.decode(refreshToken);
            if (!refreshDecoded || !refreshDecoded.jti) {
                return res.status(401).json({message: 'Invalid refresh token'});
            };

            if(accessDecoded.user.id != refreshDecoded.user.id) {
                return res.status(404).json({message: 'Access token is not couple with refresh token'});
            }
        }

        // Remove the JTI from Redis
        await redisClient.del(`${ACCESS_TOKEN}:${accessDecoded.jti}`);
        if(refreshJti) {
            await redisClient.del(`${REFRESH_TOKEN}:${refreshJti}`);
        }

        res.status(200).json({ message: 'Logged out successfully' });

    } catch (err) {
        return res.status(401).json({message: 'Some error happen when authorize token'});
    }
};

exports.refreshToken = async (req, res) => {
    let accessToken = commonUtil.getTokenFromRequest(req);
    if(!accessToken) {
        return res.status(404).json({message: 'Access token not found'});
    }

    const { refreshToken } = req.body;
    if (!refreshToken) {
        return res.status(400).json({ message: 'Refresh token is required' });
    }

    try {
        // Verify refresh token
        const refreshDecoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
        const accessDecoded = jwt.decode(accessToken);
        if(accessDecoded.user.id != refreshDecoded.user.id) {
            return res.status(404).json({message: 'Access token is not couple with refresh token'});
        }

        // Check if refresh token JTI exists in Redis
        const userId = await redisClient.get(`${REFRESH_TOKEN}:${refreshDecoded.jti}`);

        if (!userId) {
            return res.status(401).json({ message: 'Invalid or expired refresh token' });
        }

        // Generate new tokens
        const tokens = await authService.refreshToken(userId);

        // Invalidate old refresh token (optional, depends on your security requirements)
        await redisClient.del(`${ACCESS_TOKEN}:${accessDecoded.jti}`);
        await redisClient.del(`${REFRESH_TOKEN}:${refreshDecoded.jti}`);

        res.json(tokens);
    } catch (error) {
        if (error instanceof jwt.TokenExpiredError) {
            return res.status(401).json({ message: 'Refresh token expired' });
        }
        if (error instanceof jwt.JsonWebTokenError) {
            return res.status(401).json({ message: 'Invalid refresh token' });
        }

        console.error('Refresh token error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

exports.validateToken = async (req, res) => {
};