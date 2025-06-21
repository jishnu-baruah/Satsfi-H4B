const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const transactionSchema = new Schema({
  raw_intent: {
    type: String,
    required: true,
  },
  parsed_intent: {
    type: Object,
    required: true,
  },
  status: {
    type: String,
    required: true,
    default: 'pending', // e.g., pending, success, failed
  },
  response_message: {
    type: String,
    required: false,
  },
  user_address: { // Will be added later with Civic integration
    type: String,
    required: false, 
  }
}, {
  timestamps: true,
});

const Transaction = mongoose.model('Transaction', transactionSchema);

module.exports = Transaction; 