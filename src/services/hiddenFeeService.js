const HiddenFee = require("../models/HiddenFee");

const addHiddenFee = async (hiddenFeeBody) => {
  console.log(hiddenFeeBody);
  try {
    var hiddenFee = await findHiddenFee();
    if (hiddenFee) {
      if (hiddenFeeBody?.isActive !== null) {
        hiddenFee.isActive = hiddenFeeBody.isActive;
      }
      if (hiddenFeeBody?.cameroonFee !== null) {
        hiddenFee.cameroonFee = hiddenFeeBody.cameroonFee;
      }
      if (hiddenFeeBody?.otherCountriesFree !== null) {
        hiddenFee.cameroo;
        hiddenFee.otherCountriesFree = hiddenFeeBody.otherCountriesFree;
      }
    } else {
      if (hiddenFeeBody?.isActive !== null) {
        hiddenFee.isActive = hiddenFeeBody.isActive;
      }
      if (hiddenFeeBody?.otherCountriesFree !== null) {
        hiddenFee.cameroo;
        hiddenFee.otherCountriesFree = hiddenFeeBody.otherCountriesFree;
      }
    }
    await hiddenFee.save();
    console.log(hiddenFee);
    return hiddenFee;
  } catch (error) {
    throw error;
  }
};

const findHiddenFee = async () => {
  try {
    const hiddenFee = await HiddenFee.findOne();
    return hiddenFee;
  } catch (error) {
    throw error;
  }
};

const getHiddenFee = async () => {
  try {
    return await HiddenFee.findOne();
  } catch (error) {
    throw error;
  }
};

module.exports = {
  addHiddenFee,
  getHiddenFee,
};
