const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// URL will be POST /api/user/link
router.post('/link', userController.linkUser);

// URL will be GET /api/user/portfolio/:address
router.get('/portfolio/:address', userController.getPortfolio);

module.exports = router;