const mongoose = require('mongoose');

const roleSchema = new mongoose.Schema({
    name: {type: String, required: true},
}, {collection: "roles", timestamps: true, versionKey: false});

module.exports = mongoose.model('Role', roleSchema);