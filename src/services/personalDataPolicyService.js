const PersonalDataPolicy = require('../models/PersonalDataPolicy');

const addPersonalDataPolicy = async (personalDataPolicyBody) => {
  try {
    var personalDataPolicy = await findPersonalDataPolicy(personalDataPolicyBody);
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

const findPersonalDataPolicy = async (personalDataPolicyBody) => {
  try {
    const personalDataPolicy = await PersonalDataPolicy.findOne({content: personalDataPolicyBody.content});
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
