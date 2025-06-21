const express = require('express');
const router = express.Router();
const transactionController = require('../controllers/transactionController');

// URL will be POST /api/transaction/confirm
router.post('/confirm', transactionController.confirmTransaction);

module.exports = router; 