const OTP = require('../models/OTP');
const emailWithNodemailer = require('../helpers/email');
const { verify } = require('jsonwebtoken');

const sendOTP = async (name, sentTo, receiverType, purpose) => {
  try {
    const otp = Math.floor(100000 + Math.random() * 900000);

    const otpExpiryTime = process.env.OTP_EXPIRY_TIME || 3; // Default OTP expiry time is 3 minutes
    const expiredAt = new Date();
    expiredAt.setMinutes(expiredAt.getMinutes() + otpExpiryTime);

    const newOTP = new OTP({
      sentTo,
      receiverType,
      purpose,
      otp,
      expiredAt,
    });
    await newOTP.save();
    const subject = purpose === 'email-verification' ? 'Email verification code' : 'Forgot password code';

    //sending email if receiverType is email
    if (receiverType === 'email') {
      const emailData = {
        email: sentTo,
        subject: subject,
        html: `
          <h1>Hello, ${name}</h1>
          <p>Your One Time Code is <h3>${otp}</h3> to verify your account</p>
          <small>This Code is valid for 3 minutes</small>
        `
      }
      await emailWithNodemailer(emailData);
    }
    //setting timeout to reset oneTimeCode to after 3 minutes
    setTimeout(async () => {
      try {
        newOTP.status = 'expired';
        await newOTP.save();
        console.log('oneTimeCode reset to null after 3 minute');
      } catch (error) {
        console.error('Error updating oneTimeCode:', error);
        logger.error('Error updating oneTimeCode:', error)
      }
    }, 180000); // 3 minute in milliseconds
    return true;
  } catch (error) {
    throw error;
  }
}

const checkOTPByEmail = async (sentTo) => {
  try {
    return await OTP.findOne({ sentTo: sentTo, status: 'pending', expiredAt: { $gt: new Date() } })
  }
  catch (error) {
    throw error;
  }
}

const verifyOTP = async (sentTo, receiverType, purpose, otp) => {
  try {
    const otpData = await OTP.findOne({ sentTo, receiverType, purpose, otp, status: 'pending', expiredAt: { $gt: new Date() } })
    if (!otpData) {
      return false;
    }
    otpData.status = 'verified';
    await otpData.save();
    return true;
  }
  catch (error) {
    throw error;
  }
}

const checkOTPValidity = (sentTo) => {
  return OTP.findOne({ sentTo: sentTo, status: 'verified' })
}

const updateOTP = async (otpId,otpStatus) => {
  try {
    const otpData = await OTP.findById(otpId);
    if (!otpData) {
      return false;
    }
    otpData.status = otpStatus;
    await otpData.save();
    return true;
  }
  catch (error) {
    throw error;
  }
}

module.exports = {
  sendOTP,
  checkOTPByEmail,
  verifyOTP,
  checkOTPValidity,
  updateOTP
}