const PaymentInfoHistory = require("../models/PaymentInfoHistory");

const addPaymentInfoHistory = async (userBody) => {
  try {
    const paymentInfo = new PaymentInfoHistory(userBody);
    await paymentInfo.save();
    return paymentInfo;
  } catch (error) {
    throw error;
  }
};

const allPaymentHistoryInfo = async (options) => {
  try {
    const { page = 1, limit = 10 } = options;
    const skip = (page - 1) * limit;
    const paymentInfoList = await PaymentInfoHistory.find()
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 })
      .populate("userId");
    const totalResults = await PaymentInfoHistory.countDocuments();
    const totalPages = Math.ceil(totalResults / limit);
    const pagination = { totalResults, totalPages, currentPage: page, limit };
    return { paymentInfoList, pagination };
  } catch (error) {
    throw error;
  }
};

const paymnetInfoHistoryService = {
  addPaymentInfoHistory,
  allPaymentHistoryInfo,
};

module.exports = paymnetInfoHistoryService;
