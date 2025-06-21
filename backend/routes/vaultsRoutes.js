const express = require('express');
const router = express.Router();
const { getVaults } = require('../controllers/vaultsController');

router.get('/', getVaults);

module.exports = router; 