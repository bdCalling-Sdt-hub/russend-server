const mongoose = require('mongoose');

const refundAndCancellationPolicySchema = new mongoose.Schema({
  content: { type: String, required: true },
},
  { timestamps: true },
);

module.exports = mongoose.model('RefundAndCancellationPolicy', refundAndCancellationPolicySchema);