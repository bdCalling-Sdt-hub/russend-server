const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const tokenSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  token: { type: String, required: true },
}, { timestamps: true }
);

module.exports = mongoose.model('Token', tokenSchema);