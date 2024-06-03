const mongoose = require('mongoose');

const textPostSchema = new mongoose.Schema({
    content: String,
    userName: String,
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('TextPost', textPostSchema);
