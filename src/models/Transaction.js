const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema(
  {
    transactionId: { type: String, required: false },
    firstName: {
      type: String,
      required: [true, "First Name is must be given"],
      trim: true,
    },
    lastName: {
      type: String,
      required: [true, "Last Name is must be given"],
      trim: true,
    },
    phoneNumber: { type: String, required: true, trim: true },
    amountToSent: { type: Number, required: true, trim: true },
    ammountToSentCurrency: { type: String, required: true, trim: true },
    amountToReceive: { type: Number, required: true, trim: true },
    amountToReceiveCurrency: { type: String, required: true, trim: true },
    exchangeRate: { type: String, required: true },
    hiddenFees: { type: Number, required: true, trim: true },
    paymentMethod: { type: String, required: true, trim: true },
    sender: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    country: { type: mongoose.Schema.Types.ObjectId, ref: "Country" },
    countryName: { type: String, required: true, trim: true },
    userConfirmation: { type: Boolean, default: false },
    status: {
      type: String,
      enum: ["accepted", "pending", "transferred", "cancelled"],
      default: "cancelled",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Transaction", transactionSchema);
