const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth-controller');

const {protect, authorize} = require('../middlewares/auth-middleware');

router.post('/login', authController.login);
router.post('/logout', authController.logout);
router.post('/token/refresh', authController.refreshToken);
router.post('/token/access/validate', authController.validateAccessToken);
router.post('/token/refresh/validate', authController.validateRefreshToken);

module.exports = router;
