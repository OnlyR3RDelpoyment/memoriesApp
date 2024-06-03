const mongoose = require('mongoose');

const imageSchema = new mongoose.Schema({
    filename: String,
    contentType: String,
    imageBase64: String,
    userName: String,
    uploadDate: { type: Date, default: Date.now },
}, {
    timestamps : true
});

module.exports = mongoose.model('Image', imageSchema);
