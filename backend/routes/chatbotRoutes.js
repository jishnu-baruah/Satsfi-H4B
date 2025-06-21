const express = require('express');
const { handleChat, clearChatHistory } = require('../controllers/chatbotController');

const router = express.Router();

router.post('/query', handleChat);
router.delete('/history', clearChatHistory);

module.exports = router;