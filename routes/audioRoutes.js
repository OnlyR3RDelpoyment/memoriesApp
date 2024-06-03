const express = require('express');
const multer = require('multer');
const Audio = require('../models/audio');
const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post('/upload', upload.single('audio'), async (req, res) => {
    try {
        const newAudio = new Audio({
            title : req.body.title,
            filename: req.file.originalname,
            contentType: req.file.mimetype,
            audioBase64: req.file.buffer.toString('base64'),
            userName : req.body.userName
        });
        await newAudio.save();
        res.status(201).send('Audio uploaded successfully');
    } catch (err) {
        res.status(500).send('Error uploading audio');
    }
});

router.get('/:id', async (req, res) => {
    try {
        const audio = await Audio.findById(req.params.id);
        if (!audio) {
            return res.status(404).send('Audio not found');
        }
        res.set('Content-Type', audio.contentType);
        res.send(Buffer.from(audio.audioBase64, 'base64'));
    } catch (err) {
        res.status(500).send('Error retrieving audio');
    }
});

// Get audio files by userName
router.get('/user/:userName', async (req, res) => {
    try {
        const audios = await Audio.find({ userName: req.params.userName });
        if (audios.length === 0) {
            return res.status(404).send('No audios found for this user');
        }
        res.status(200).json(audios);
    } catch (err) {
        res.status(500).send('Error retrieving audios');
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const deletedAudio = await Audio.findByIdAndDelete(req.params.id);
        if (!deletedAudio) {
            return res.status(404).send('Audio not found');
        }
        res.status(200).send('Audio deleted successfully');
    } catch (err) {
        res.status(500).send('Error deleting audio');
    }
});

module.exports = router;
