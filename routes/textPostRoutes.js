const express = require('express');
const TextPost = require('../models/textPost');
const Location = require('../models/location');
const router = express.Router();

// Create a new text post
router.post('/create', async (req, res) => {
    const { content, userName } = req.body;
    try {
        const newTextPost = new TextPost({ content, userName });
        await newTextPost.save();
        res.status(201).send('Text post created successfully');
    } catch (err) {
        res.status(500).send('Error creating text post');
    }
});


// Get text posts of a particular user
router.get('/user/:userName', async (req, res) => {
    const { page = 1, limit = 10 } = req.query;
    try {
        const textPosts = await TextPost.find({ userName: req.params.userName })
            .sort({ createdAt: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .exec();

        const count = await TextPost.countDocuments({ userName: req.params.userName });

        res.status(200).json({
            textPosts,
            totalPages: Math.ceil(count / limit),
            currentPage: page
        });
    } catch (err) {
        res.status(500).send('Error retrieving text posts');
    }
});

router.post('/location', async (req, res) => {
    const { latitude , longitude , userName } = req.body;
    try {
        const newLoaction = new Location({ latitude, longitude, userName });
        await newLoaction.save();
        res.status(201).json({msg:'Success'});  
    } catch (err) {
        res.status(500).json({msg:'Error posting Love'});
    }
});

module.exports = router;
