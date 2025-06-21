const mongoose = require('mongoose');

const ChatMessageSchema = new mongoose.Schema({
  userAddress: {
    type: String,
    required: true,
    lowercase: true,
    index: true,
  },
  role: {
    type: String,
    enum: ['user', 'model'], // 'user' for user messages, 'model' for AI responses
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
}, {
  timestamps: true, // Adds createdAt and updatedAt timestamps
});

module.exports = mongoose.model('ChatMessage', ChatMessageSchema); 