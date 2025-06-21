require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const intentRoutes = require('./routes/intentRoutes');
const priceRoutes = require('./routes/priceRoutes');
const userRoutes = require('./routes/userRoutes');
const transactionRoutes = require('./routes/transactionRoutes');
const priceCacheService = require('./services/priceCacheService');

const app = express();
const PORT = process.env.PORT || 5001;

// Request Logger Middleware
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] INCOMING: ${req.method} ${req.originalUrl}`);
    next();
});

// Middleware
app.use(cors()); // Allow all origins
app.use(express.json());

// Routes
app.use('/api/intent', intentRoutes);
app.use('/api/prices', priceRoutes);
app.use('/api/user', userRoutes);
app.use('/api/transaction', transactionRoutes);

// Start services
priceCacheService.start();

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
    console.error("CRITICAL ERROR: MONGODB_URI is not defined in environment variables.");
    process.exit(1);
}

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