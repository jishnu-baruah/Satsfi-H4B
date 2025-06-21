const express = require('express');
const router = express.Router();
const { explainIntent, explainMore } = require('../controllers/explainController');

router.post('/', explainIntent);
router.post('/more', explainMore);

module.exports = router; 