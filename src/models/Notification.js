const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  message: { type: String, required: false },
  linkId: { type: String, required: false },
  type: { type: String, enum:['user','Transaction'], required: false },
  role: { type: [String], enum: ['admin', 'worker', 'user'], default: ['user'] }, // Changed to array and added 'worker' enum
  receiver: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

module.exports = mongoose.model('Notification', notificationSchema);
