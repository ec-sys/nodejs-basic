const express = require('express');
const router = express.Router();
const userController = require('../controllers/user-controller');

const {protect, authorize} = require('../middlewares/auth-middleware');

router.use(protect);
router.use(authorize('ADMIN'));

// GET /api/users
router.get('/', userController.getAllUsers);

// GET /api/users/:id
router.get('/:id', userController.getUserById);

// POST /api/users
router.post('/', userController.createUser);

// DELETE /api/users/:id
router.delete('/:id', userController.deleteUser)

// UPDATE /api/users/:id
router.put('/:id', userController.updateUser);

module.exports = router;
