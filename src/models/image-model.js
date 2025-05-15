const mongoose = require('mongoose');

const imageSchema = mongoose.Schema(
    {
        userId: {
            type: String,
            required: true,
        },
        fileName: {
            type: String,
            required: true
        },
        originalName: {
            type: String,
            required: true
        },
        path: {
            type: String,
            required: true
        },
        mimeType: {
            type: String,
            required: true
        },
        size: {
            type: Number,
            required: true
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model('Image', imageSchema);