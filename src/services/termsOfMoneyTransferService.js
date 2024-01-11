const TermsOfMoneyTransfer = require('../models/TermsOfMoneyTransfer');

const addTermsOfMoneyTransfer = async (termsOfMoneyTransferBody) => {
  try {
    var termsOfMoneyTransfer = await findTermsOfMoneyTransfer(termsOfMoneyTransferBody);
    if (termsOfMoneyTransfer) {
      termsOfMoneyTransfer.content = termsOfMoneyTransferBody.content;
    }
    else {
      termsOfMoneyTransfer = new TermsOfMoneyTransfer({content: termsOfMoneyTransferBody.content});
    }
    await termsOfMoneyTransfer.save();
    return termsOfMoneyTransfer;
  } catch (error) {
    throw error;
  }
}

const findTermsOfMoneyTransfer = async (termsOfMoneyTransferBody) => {
  try {
    const termsOfMoneyTransfer = await TermsOfMoneyTransfer.findOne({content: termsOfMoneyTransferBody.content});
    return termsOfMoneyTransfer;
  } catch (error) {
    throw error;
  }
}

const getTermsOfMoneyTransfers = async () => {
  try {
    return await TermsOfMoneyTransfer.findOne().select('content');
  }
  catch (error) {
    throw error;
  }
}

module.exports = {
  addTermsOfMoneyTransfer,
  getTermsOfMoneyTransfers
}
