const asyncHandler = require('express-async-handler');
const Image = require('../models/image-model');
const logger = require('../utils/logger');
const fs = require('fs');
const path = require('path');

exports.uploadImage = asyncHandler(async (req, res) => {
    let userId = req.user.id;
    // Check if file exists in request
    if (!req.file) {
        logger.warn('Image upload failed - No file provided', { userId: userId });
        res.status(400);
        throw new Error('Please upload a file');
    }

    try {
        // Create image record in database
        const image = await Image.create({
            userId: userId,
            fileName: req.file.filename,
            originalName: req.file.originalname,
            path: req.file.path,
            mimeType: req.file.mimetype,
            size: req.file.size
        });

        logger.info('Image uploaded successfully', {
            userId: userId,
            imageId: image._id.toString()
        });

        res.status(201).json({
            _id: image._id,
            fileName: image.fileName,
            originalName: image.originalName,
            url: `/${process.env.UPLOAD_PATH || 'uploads'}/${image.filename}`,
            message: 'Image uploaded successfully'
        });
    } catch (error) {
        // If there's an error, delete the uploaded file
        if (req.file) {
            fs.unlink(req.file.path, (err) => {
                if (err) {
                    logger.error(`Failed to delete file after DB error: ${err.message}`);
                }
            });
        }

        logger.error(`Image upload error: ${error.message}`, { userId: userId });
        res.status(500);
        throw new Error('Image upload failed');
    }
});
