const TermsOfService = require('../models/TermsOfService');

const addTermsOfService = async (termsOfServiceBody) => {
  try {
    var termsOfService = await findTermsOfService(termsOfServiceBody);
    if (termsOfService) {
      termsOfService.content = termsOfServiceBody.content;
    }
    else {
      termsOfService = new TermsOfService(termsOfServiceBody);
    }
    await termsOfService.save();
    return termsOfService;
  } catch (error) {
    throw error;
  }
}

const findTermsOfService = async (termsOfServiceBody) => {
  try {
    const termsOfService = await TermsOfService.findOne({content: termsOfServiceBody.content});
    return termsOfService;
  } catch (error) {
    throw error;
  }
}

const getTermsOfServices = async () => {
  try {
    return await TermsOfService.findOne().select('content');
  }
  catch (error) {
    throw error;
  }
}

module.exports = {
  addTermsOfService,
  getTermsOfServices
}
