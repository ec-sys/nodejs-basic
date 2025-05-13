const express = require('express');
const router = express.Router();
const userController = require('../controllers/user-controller');

// GET /api/users
router.get('/', userController.getAllUsers);

// GET /api/users/:id
router.get('/:id', userController.getUserById);

// POST /api/users
router.post('/', userController.createUser);

module.exports = router;
