const mongoose = require('mongoose');

const termsOfMoneyTransferSchema = new mongoose.Schema({
  content: { type: String, required: true },
},
  { timestamps: true },
);

module.exports = mongoose.model('TermsOfMoneyTransfer', termsOfMoneyTransferSchema);