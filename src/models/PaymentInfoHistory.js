const mongoose = require("mongoose");

const paymentInfoHistorySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    userRole: { type: String, required: true },
    userEmail: { type: String, required: true },
    name: { type: String, required: true },
    bankName: { type: String, required: true },
    phoneNumber: { type: String, required: true },
  },
  { timestamps: true }
);

const PaymentInfoHistory = mongoose.model(
  "PaymentInfoHistory",
  paymentInfoHistorySchema
);
module.exports = PaymentInfoHistory;
