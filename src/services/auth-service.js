const userRepository = require('../repositories/user-repository');
const roleRepository = require('../repositories/role-repository');
const {redisClient} = require('../configs/redis-config');
const {v4: uuidv4} = require('uuid');
const {REFRESH_TOKEN, ACCESS_TOKEN} = require('../constants/common-constant');

const cryptUtil = require('../utils/crypt-util');
const jwt = require('jsonwebtoken');

function generateAccessToken(user, roleNames, tokenId) {
    let payload = {
        tenant: {},
        user: {
            id: user._id,
            name: user.name,
            email: user.email,
            age: user.age,
            roles: roleNames
        }
    }
    return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
        jwtid: tokenId
    });
}

function generateRefreshToken(user, tokenId) {
    let payload = {
        id: user._id
    }
    return jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, {
        expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
        jwtid: tokenId
    });
}


/**
 * return {accessTokenId, refreshTokenId}
 * @param user
 */
async function saveTokenId(user) {
    let userId = user._id.toString();

    let accessJti = uuidv4();
    let accessExpirySecond = parseInt(process.env.ACCESS_TOKEN_EXPIRY) * 60 * 24;
    await redisClient.setEx(`${ACCESS_TOKEN}:${accessJti}`, accessExpirySecond, userId);

    let refreshJti = uuidv4();
    let refreshExpirySecond = parseInt(process.env.REFRESH_TOKEN_EXPIRY) * 60 * 24;
    await redisClient.setEx(`${REFRESH_TOKEN}:${refreshJti}`, refreshExpirySecond, userId);

    return {
        accessJti: accessJti,
        refreshJti: refreshJti
    }
}

class AuthService {
    async login(email, password) {
        // Validate email & password
        if (!email || !password) {
            throw new Error('Please provide an email and password');
        }

        // Check for user
        const user = await userRepository.findByEmail(email);
        if (!user) {
            throw new Error('Invalid credentials');
        }

        // Check if password matches
        const isMatch = cryptUtil.comparePassword(password, user.password);
        if (!isMatch) {
            throw new Error('Invalid credentials');
        }

        // Get role names
        let roleNames = [];
        let roles = await roleRepository.findByIds(user.roleIds);
        roles.forEach((item) => {
            roleNames.push(item.name);
        });

        let tokenId = await saveTokenId(user);
        return {
            accessToken: generateAccessToken(user, roleNames, tokenId.accessJti),
            refreshToken: generateRefreshToken(user, tokenId.refreshJti)
        }
    }
}

module.exports = new AuthService();