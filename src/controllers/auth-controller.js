const authService = require('../services/auth-service');

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
};

exports.refreshToken = async (req, res) => {
};

exports.validateToken = async (req, res) => {
};