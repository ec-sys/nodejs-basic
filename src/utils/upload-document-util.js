const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

// Create uploads folder if it doesn't exist
const uploadDir = path.join(__dirname, `../../${process.env.UPLOAD_DOCUMENT_PATH || 'uploads/documents'}`);
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure storage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        // Create unique filename with original extension
        const fileExt = path.extname(file.originalname);
        const fileName = `${uuidv4()}${fileExt}`;
        cb(null, fileName);
    }
});

// File filter function
const fileFilter = (req, file, cb) => {
    // Accept images only
    if (!file.originalname.match(/\.(doc|docx|xls|xlsx|csv|pdf)$/)) {
        return cb(new Error('Only document files are allowed!'), false);
    }
    cb(null, true);
};

// Create multer uploadImageUtil instance
const uploadDocumentUtil = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    }
});

module.exports = uploadDocumentUtil;