const mongoose = require('mongoose');

const KnowledgeArticleSchema = new mongoose.Schema({
  topic: {
    type: String,
    required: true,
    unique: true, // Each topic should be unique
  },
  content: {
    type: String,
    required: true,
  },
  keywords: {
    type: [String],
    default: [],
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('KnowledgeArticle', KnowledgeArticleSchema); 