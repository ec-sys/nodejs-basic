const express = require('express');
const router = express.Router();
const uploadController = require('../controllers/upload-controller');
const { protect, authorize } = require('../middlewares/auth-middleware');
const upload = require('../utils/upload')

router.post('/', protect, upload.single('image'), uploadController.uploadImage);

module.exports = router;
