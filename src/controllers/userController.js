require('dotenv').config();
const User = require('../models/User');
const OTP = require('../models/OTP');
const Registration = require('../models/Registration');
const response = require("../helpers/response");
const jwt = require('jsonwebtoken');
require('dotenv').config();
//defining unlinking image function 
const unlinkImages = require('../common/image/unlinkImage')
const logger = require("../helpers/logger");
const { addRegistration, getRegisteredUserByEmail, updateRegisteredUserData, deleteUserRegistration } = require('../services/registrationService');
const { addUser, login, getUserByEmail } = require('../services/userService')
const { sendOTP, checkOTPByEmail, verifyOTP, checkOTPValidity } = require('../services/otpService');

function validatePassword(password) {
  const hasNumber = /\d/.test(password);
  const hasLetter = /[a-zA-ZÀ-ÖØ-öø-ÿ]/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  return password.length >= 8 && hasNumber && (hasLetter || hasSpecialChar);
}

function hashedPassword(password) {
  const saltRounds = 10;
  const salt = bcrypt.genSaltSync(saltRounds);
  const hash = bcrypt.hashSync(password, salt);
  return hash;
}

//Sign up
const signUp = async (req, res) => {
  try {
    var { fullName, email, phoneNumber, password, role } = req.body;

    const userExist = await getRegisteredUserByEmail(email);

    if (userExist) {
      const existingOTP = await checkOTPByEmail(email);
      if (existingOTP) {
        console.log('OTP already exists', existingOTP);
        return res.status(409).json(response({ status: 'Error', statusCode: '409', type: 'user', message: req.t('otp-exists'), data: null }));
      }
      const otpData = await sendOTP(userExist.fullName, email, 'email', 'email-verification');
      if (otpData) {
        return res.status(200).json(response({ status: 'Error', statusCode: '200', type: 'user', message: req.t('otp-sent'), data: null }));
      }
    }
    else {
      // Create the user in the database
      const user = new Registration({
        fullName,
        email,
        phoneNumber,
        password,
        role
      });

      await addRegistration(user);

      const otpData = await sendOTP(fullName, email, 'email', 'email-verification');

      if (otpData) {
        res.status(201).json(response({
          status: "Created",
          message: req.t("registration-success"),
          statusCode: 201,
          type: "user",
          data: user,
        }));
      }
    }
  } catch (error) {
    console.error(error);
    logger.error(error, req.originalUrl)
    return res.status(500).json(response({ status: 'Error', statusCode: '500', type: 'user', message: req.t('registration-failed') }));
  }
};

const verifyEmail = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const user = await getRegisteredUserByEmail(email);
    if (!user) {
      return res.status(404).json(response({ status: 'Error', statusCode: '404', type: 'user', message: req.t('user-not-exists') }));
    }
    const otpVerified = await verifyOTP(email, 'email', 'email-verification', otp);
    if (!otpVerified) {
      return res.status(400).json(response({ status: 'Error', statusCode: '400', type: 'user', message: req.t('invalid-otp') }));
    }
    const userData = {
      fullName: user.fullName,
      email: user.email,
      phoneNumber: user.phoneNumber,
      password: user.password,
      role: user.role,
    }
    await addUser(userData);
    await deleteUserRegistration(user._id);
    res.status(200).json(response({ status: 'OK', statusCode: '200', type: 'user', message: req.t('user-verified') }));
  }
  catch (error) {
    console.error(error);
    logger.error(error, req.originalUrl)
    return res.status(500).json(response({ status: 'Error', statusCode: '500', type: 'user', message: req.t('registration-failed') }));
  }
}
//Sign in
const signIn = async (req, res) => {
  try {
    //Get email password from req.body
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json(response({ statusCode: 200, message: req.t('login-credentials-required'), status: "OK" }));
    }

    const user = await login(email, password);

    if (user) {
      const accessToken = jwt.sign({ _id: user._id, email: user.email, role: user.role }, process.env.JWT_ACCESS_TOKEN, { expiresIn: '30d' });
      
      return res.status(200).json(response({ statusCode: 200, message: req.t('login-success'), status: "OK", type: "user", data: user, token: accessToken }));
    }
    return res.status(401).json(response({ statusCode: 200, message: req.t('login-failed'), status: "OK" }));

  } catch (error) {
    console.error(error);
    logger.error(error, req.originalUrl)
    return res.status(500).json(response({ statusCode: 200, message: req.t('login-error'), status: "OK", error }));
  }
};

const forgetPassword = async (req, res) => {
  try{
    const { email } = req.body;
    const user = await getUserByEmail(email)
    if (!user) {
      return res.status(404).json(response({ status: 'Error', statusCode: '404', type: 'user', message: req.t('user-not-exists') }));
    }
    const otpData = await sendOTP(user.fullName, email, 'email', 'forget-password');
    if (otpData) {
      return res.status(200).json(response({ status: 'OK', statusCode: '200', type: 'user', message: req.t('forget-password-sent') }));
    }
    return res.status(400).json(response({ status: 'Error', statusCode: '400', type: 'user', message: req.t('forget-password-error') }));
  }
  catch(error){
    console.error(error);
    logger.error(error, req.originalUrl)
    return res.status(500).json(response({ statusCode: 200, message: req.t('forget-password-failed'), status: "OK", error }));
  }
}

const verifyForgetPasswordOTP = async (req, res) => {
  try{
    const { email, otp } = req.body;
    const user = await getUserByEmail(email);
    if (!user) {
      return res.status(404).json(response({ status: 'Error', statusCode: '404', type: 'user', message: req.t('user-not-exists') }));
    }
    const otpVerified = await verifyOTP(email, 'email', 'forget-password', otp);
    if (!otpVerified) {
      return res.status(400).json(response({ status: 'Error', statusCode: '400', type: 'user', message: req.t('invalid-otp') }));
    }
    return res.status(200).json(response({ status: 'OK', statusCode: '200', type: 'user', message: req.t('otp-verified') }));
  }
  catch(error){
    console.error(error);
    logger.error(error, req.originalUrl)
    return res.status(500).json(response({ statusCode: 200, message: req.t('otp-verification-failed'), status: "OK", error }));
  }
}

const resetPassword = async (req, res) => {
  try{
    const { email, password } = req.body;
    const user = await getUserByEmail(email);
    if (!user) {
      return res.status(404).json(response({ status: 'Error', statusCode: '404', type: 'user', message: req.t('user-not-exists') }));
    }
    const otpVerified = await checkOTPValidity(email);
    if(!otpVerified){
      return res.status(400).json(response({ status: 'Error', statusCode: '400', type: 'user', message: req.t('otp-expired') }));
    }
    const isValidPassword = validatePassword(password);
    if (!isValidPassword) {
      return res.status(400).json(response({ status: 'Error', statusCode: '400', type: 'user', message: req.t('password-format-error') }));
    }
    
    const passwordAfterHassed = hashedPassword(password);
    user.password = passwordAfterHassed;
    await user.save();
    return res.status(200).json(response({ status: 'OK', statusCode: '200', type: 'user', message: req.t('password-reset-success') }));
  }
  catch(error){
    console.error(error);
    logger.error(error, req.originalUrl)
    return res.status(500).json(response({ statusCode: 200, message: req.t('password-reset-failed'), status: "OK", error }));
  }
}

module.exports = { signUp, verifyEmail, signIn, forgetPassword, verifyForgetPasswordOTP, resetPassword }