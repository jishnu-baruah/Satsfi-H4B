const express = require('express');
const router = express.Router();
const { getPrices, getHistoricalData } = require('../controllers/priceController');

router.get('/', getPrices);
router.get('/historical', getHistoricalData);

module.exports = router; 