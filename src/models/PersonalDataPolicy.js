const mongoose = require('mongoose');

const personalDataPolicySchema = new mongoose.Schema({
  content: { type: String, required: true },
},
  { timestamps: true },
);

module.exports = mongoose.model('PersonalDataPolicy', personalDataPolicySchema);