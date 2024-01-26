const mongoose = require('mongoose');

const countrySchema = new mongoose.Schema({
  name: { type: String, required: [true, 'Country Name is required'], trim: true },
  countryCode: { type: String, required: [true, 'Country code is required'], trim: true },
  currency: { type: String, required: [true, 'Country currency is required'] },
  countryFlag: { type: String, required: [true, 'Country flag is required'] },
  paymentGateways: [{
    name: { type: String, required: [true, 'Payment gateway name is required'] },
    logo: { type: String, required: [true, 'Payment gateway logo is required'] },
  }],
  isPaymentAvailable: { type: Boolean, default: false },
}, { timestamps: true }
);

module.exports = mongoose.model('Country', countrySchema);