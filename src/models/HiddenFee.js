const mongoose = require("mongoose");

const hiddedFeeSchema = new mongoose.Schema(
  {
    cameroonFee: { type: Number, default: 0 },
    otherCountriesFree: { type: Number, default: 0 },
    isActive: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("HiddenFee", hiddedFeeSchema);
