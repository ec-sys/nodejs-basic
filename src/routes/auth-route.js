const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth-controller');

const {protect, authorize} = require('../middlewares/auth-middleware');

router.post('/login', authController.login);
router.post('/logout', authController.logout);
router.post('/token/refresh', authController.refreshToken);
router.post('/token/validate', authController.validateToken);

module.exports = router;
