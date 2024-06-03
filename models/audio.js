const mongoose = require('mongoose');

const audioSchema = new mongoose.Schema({
    title: String,
    filename: String,
    contentType: String,
    audioBase64: String,
    userName: String,
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Audio', audioSchema);
