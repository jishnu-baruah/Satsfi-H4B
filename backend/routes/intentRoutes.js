const express = require('express');
const router = express.Router();
const intentController = require('../controllers/intentController');
const { getTransactions, getUserTransactions } = require('../controllers/lendingController');

// URL will be POST /api/intent
router.post('/process', intentController.processIntent);
router.get('/transactions', getTransactions);
router.get('/transactions/:address', getUserTransactions);

module.exports = router; 