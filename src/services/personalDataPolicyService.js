const PersonalDataPolicy = require('../models/PersonalDataPolicy');

const addPersonalDataPolicy = async (personalDataPolicyBody) => {
  try {
    var personalDataPolicy = await findPersonalDataPolicy();
    if (personalDataPolicy) {
      personalDataPolicy.content = personalDataPolicyBody.content;
    }
    else {
      personalDataPolicy = new PersonalDataPolicy(personalDataPolicyBody);
    }
    await personalDataPolicy.save();
    return personalDataPolicy;
  } catch (error) {
    throw error;
  }
}

const findPersonalDataPolicy = async () => {
  try {
    const personalDataPolicy = await PersonalDataPolicy.findOne();
    return personalDataPolicy;
  } catch (error) {
    throw error;
  }
}

const getPersonalDataPolicys = async () => {
  try {
    return await PersonalDataPolicy.findOne().select('content');
  }
  catch (error) {
    throw error;
  }
}

module.exports = {
  addPersonalDataPolicy,
  getPersonalDataPolicys
}
