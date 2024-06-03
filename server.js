require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors'); // Import the cors package
const imageRoutes = require('./routes/imageRoutes');
const audioRoutes = require('./routes/audioRoutes');
const textPostRoutes = require('./routes/textPostRoutes');

const app = express();
const port = process.env.PORT || 3030;

app.use(express.json());
app.use(cors()); // Enable CORS for all routes
app.use('/api/images', imageRoutes);
app.use('/api/audios', audioRoutes);
app.use('/api/text', textPostRoutes);

app.use('/', (req, res) => {
    res.status(200).json({ data: "Working fine", status: "Sucess" })
});

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Could not connect to MongoDB', err));

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
