const userRepository = require('../repositories/user-repository');
const roleRepository = require('../repositories/role-repository');

const cryptUtil = require('../utils/crypt-util');
const jwt = require('jsonwebtoken');

function generateAccessToken(user, roleNames) {
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
    return jwt.sign(payload, process.env.JWT_SECRET, {expiresIn: process.env.JWT_EXPIRE, jwtid: "id_in_redis"});
}

function generateRefreshToken(user) {
    let payload = {
        id: user._id
    }
    return jwt.sign(payload, process.env.REFRESH_SECRET, {expiresIn: process.env.REFRESH_EXPIRE});
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

        return {
            accessToken: generateAccessToken(user, roleNames),
            refreshToken: generateRefreshToken(user)
        }
    }
}

module.exports = new AuthService();