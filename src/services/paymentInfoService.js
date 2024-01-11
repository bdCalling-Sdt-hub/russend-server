const PaymentInfo = require('../models/PaymentInfo');

const addPaymentInfo = async (paymentInfoBody) => {
  try {
    var paymentInfo = await findPaymentInfo();
    if (paymentInfo) {
      paymentInfo.name = paymentInfoBody.name;
      paymentInfo.bankName = paymentInfoBody.bankName;
      paymentInfo.phoneNumber = paymentInfoBody.phoneNumber;
    }
    else {
      paymentInfo = new PaymentInfo(paymentInfoBody);
    }
    await paymentInfo.save();
    return paymentInfo;
  } catch (error) {
    throw error;
  }
}

const findPaymentInfo = async () => {
  try {
    const paymentInfo = await PaymentInfo.findOne();
    return paymentInfo;
  } catch (error) {
    throw error;
  }
}

const getPaymentInfo = async () => {
  try {
    return await PaymentInfo.findOne();
  }
  catch (error) {
    throw error;
  }
}

module.exports = {
  addPaymentInfo,
  getPaymentInfo
}
