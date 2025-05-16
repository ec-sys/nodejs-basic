const jwt = require('jsonwebtoken');
const {redisClient} = require('../configs/redis-config');
const {ACCESS_TOKEN} = require("../constants/common-constant");
const commonUtil = require('../utils/common-util');

exports.protect = async (req, res, next) => {
    let token = commonUtil.getTokenFromRequest(req);
    // Make sure token exists
    if (!token) {
        return res.status(401).json({
            success: false,
            message: 'Not authorized to access this route',
        });
    }

    try {
        // Verify token
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

        // Verify token id in cache for prevent relay token
        if (!decoded || !decoded.jti) return res.status(401).json({message: 'Invalid token'});
        // Check if JTI exists in Redis
        const jtiExists = await redisClient.exists(`${ACCESS_TOKEN}:${decoded.jti}`);
        if (!jtiExists) {
            return res.status(401).json({message: 'Token has been revoked or is invalid'});
        }

        // Set payload and next process
        req.tenant = decoded.tenant;
        req.user = decoded.user;
        next();
    } catch (err) {
        return res.status(401).json({
            success: false,
            message: 'Not authorized to access this route',
        });
    }
};

// Grant access to specific roles
exports.authorize = (...roles) => {
    return (req, res, next) => {
        let isAccept = false;
        // Validate user roles in list roles
        req.user.roles.forEach((role) => {
            if (roles.includes(role)) {
                isAccept = true;

            }
        })
        if (!isAccept) {
            return res.status(403).json({
                success: false,
                message: `User role ${req.user.roles} is not authorized to access this route`,
            });
        }
        next();
    };
};