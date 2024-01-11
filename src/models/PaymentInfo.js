const mongoose = require('mongoose');

const paymentInfoSchema = new mongoose.Schema({
  name: { type: String, required: false },
  bankName: { type: String, required: false },
  phoneNumber: { type: String, required: false },
}, { timestamps: true }
);

module.exports = mongoose.model('PaymentInfo', paymentInfoSchema);