const HiddenFee = require('../models/HiddenFee');

const addHiddenFee = async (hiddenFeeBody) => {
  try {
    var hiddenFee = await findHiddenFee();
    if (hiddenFee) {
      hiddenFee.isActive = hiddenFeeBody.isActive;
      hiddenFee.percentage = hiddenFeeBody.percentage;
    }
    else {
      hiddenFee = new HiddenFee(hiddenFeeBody);
    }
    await hiddenFee.save();
    return hiddenFee;
  } catch (error) {
    throw error;
  }
}

const findHiddenFee = async () => {
  try {
    const hiddenFee = await HiddenFee.findOne();
    return hiddenFee;
  } catch (error) {
    throw error;
  }
}

const getHiddenFee = async () => {
  try {
    return await HiddenFee.findOne({isActive:true});
  }
  catch (error) {
    throw error;
  }
}

module.exports = {
  addHiddenFee,
  getHiddenFee
}
