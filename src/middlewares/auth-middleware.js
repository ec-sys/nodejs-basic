const jwt = require('jsonwebtoken');

exports.protect = async (req, res, next) => {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        // Set token from Bearer token in header
        token = req.headers.authorization.split(' ')[1];
    }

    // Make sure token exists
    if (!token) {
        return res.status(401).json({
            success: false,
            message: 'Not authorized to access this route',
        });
    }

    try {
        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Verify token id in cache for prevent relay token
        let jti = decoded.jti;
        if(!jti) {
            return res.status(401).json({
                success: false,
                message: 'Invalid token',
            });
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
            if(roles.includes(role)) {
                isAccept = true;
                return;
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