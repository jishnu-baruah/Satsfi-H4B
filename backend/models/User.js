const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    index: true,
  },
  walletAddresses: [{
    type: String,
    required: true,
    lowercase: true,
  }],
}, {
  timestamps: true,
});

// Ensure wallet addresses are unique within the array for a given user
userSchema.pre('save', function(next) {
  if (this.isModified('walletAddresses')) {
    this.walletAddresses = [...new Set(this.walletAddresses)];
  }
  next();
});

const User = mongoose.model('User', userSchema);

module.exports = User; 