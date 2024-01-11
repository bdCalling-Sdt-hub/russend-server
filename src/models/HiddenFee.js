const mongoose = require('mongoose');

const hiddedFeeSchema = new mongoose.Schema({
  percentage: { type: Number, default: 0 },
  isActive: { type: Boolean, default: false },
}, { timestamps: true }
);

module.exports = mongoose.model('HiddenFee', hiddedFeeSchema);