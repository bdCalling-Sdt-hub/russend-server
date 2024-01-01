const Registration = require('../models/Registration');

const addRegistration = async (registrationBody) => {
  try {
    const registration = new Registration(registrationBody);
    await registration.save();
    return registration;
  } catch (error) {
    throw error;
  }
}

const getRegisteredUserByEmail = async (email) => {
  return await Registration.findOne({ email });
}

const updateRegisteredUserData = async (registrationId, registrationBody) => {
  const existingRegistration = await Registration.findById(registrationId);
  if (!existingRegistration) {
    throw new Error('Registration not found');
  }
  const registration = new Registration(registrationBody);
  Object.assign(existingRegistration, registration);
  await existingRegistration.save();
  return existingRegistration;
}

module.exports = {
  addRegistration,
  getRegisteredUserByEmail,
  updateRegisteredUserData
}