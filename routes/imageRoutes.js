const express = require('express');
const multer = require('multer');
const Image = require('../models/image');
const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post('/upload', upload.array('images', 10), async (req, res) => {
    const { userName } = req.body;
    try {
        if (!req.files) {
            return res.status(400).send('No files uploaded');
        }

        const images = req.files.map(file => ({
            filename: file.originalname,
            contentType: file.mimetype,
            imageBase64: file.buffer.toString('base64'),
            userName: userName,
        }));

        await Image.insertMany(images);
        res.status(201).send('Images uploaded successfully');
    } catch (err) {
        res.status(500).send('Error uploading images');
    }
});

router.get('/:id', async (req, res) => {
    try {
        const image = await Image.findById(req.params.id);
        if (!image) {
            return res.status(404).send('Image not found');
        }
        res.set('Content-Type', image.contentType);
        res.send(Buffer.from(image.imageBase64, 'base64'));
    } catch (err) {
        res.status(500).send('Error retrieving image');
    }
});


// New route to fetch images by userName with pagination
router.get('/gallery/:userName', async (req, res) => {
    const { page = 1, limit = 0 } = req.query; // Default to page 1 and limit 10
    try {
        const images = await Image.find({ userName: req.params.userName })
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .exec();

        const count = await Image.countDocuments({ userName: req.params.userName });

        res.status(200).json({
            images,
            totalPages: Math.ceil(count / limit),
            currentPage: page
        });
    } catch (err) {
        res.status(500).send('Error retrieving images');
    }
});

// Delete image by ID
router.delete('/:id', async (req, res) => {
    try {
        const deletedImage = await Image.findByIdAndDelete(req.params.id);
        if (!deletedImage) {
            return res.status(404).send('Image not found');
        }
        res.status(200).send('Image deleted successfully');
    } catch (err) {
        res.status(500).send('Error deleting image');
    }
});

module.exports = router;
