const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const transactionSchema = new Schema({
  raw_intent: {
    type: String,
    required: true,
  },
  userAddress: {
    type: String,
    required: false, // Not all old transactions will have this
    index: true, // Index for faster querying
  },
  parsed_intent: {
    type: Object,
    required: true,
  },
  status: {
    type: String,
    required: true,
    default: 'pending_review', // pending_review, success, failed
  },
  response_message: {
    type: String,
    required: false,
  },
}, {
  timestamps: true,
});

const Transaction = mongoose.model('Transaction', transactionSchema);

module.exports = Transaction; 