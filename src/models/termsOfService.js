const mongoose = require('mongoose');

const termsOfServiceSchema = new mongoose.Schema({
  content: { type: String, required: true },
},
  { timestamps: true },
);

module.exports = mongoose.model('TermsOfService', termsOfServiceSchema);