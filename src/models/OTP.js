const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const otpSchema = new mongoose.Schema({
  sentTo: {
    type: String,
    required: [true, 'Receiver source is required'],
  },
  receiverType: { type: String, enum: ['email', 'phone'], default: 'email' },
  purpose: { type: String, enum: ['email-verification', 'forgot-password'], default: 'signup' },
  otp: { type: String, required: [true, 'OTP is must be given'], trim: true },
  expiredAt: { type: Date, required: [true, 'ExpiredAt is must be given'], trim: true },
  status: { type: String, enum: ['verified', 'pending', 'expired'], default: 'pending' },
}, {
  timestamps: true
});

module.exports = mongoose.model('OTP', otpSchema);