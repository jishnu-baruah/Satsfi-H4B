require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const intentRoutes = require('./routes/intentRoutes');
const priceRoutes = require('./routes/priceRoutes');
const priceCacheService = require('./services/priceCacheService');

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/intent', intentRoutes);
app.use('/api/prices', priceRoutes);

// Start services
priceCacheService.start();

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI;

mongoose.connect(MONGODB_URI)
    .then(() => {
        console.log('MongoDB connected successfully.');
        // Start Server only after DB connection is successful
        app.listen(PORT, () => {
          console.log(`Server is running on port ${PORT}`);
        });
    })
    .catch(err => {
        console.error('MongoDB connection error:', err);
        process.exit(1); // Exit process with failure
    }); 