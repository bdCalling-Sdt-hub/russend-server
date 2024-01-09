require('dotenv').config();
const response = require("../helpers/response");
const jwt = require('jsonwebtoken');
require('dotenv').config();
const bcrypt = require('bcryptjs');
//defining unlinking image function 
const unlinkImages = require('../common/image/unlinkImage')
const logger = require("../helpers/logger");
const { addUser, login, getUserByEmail, getAllUsers, getUserById } = require('../services/userService')
const { sendOTP, checkOTPByEmail, verifyOTP, checkOTPValidity, updateOTP } = require('../services/otpService');
const { addToken, verifyToken, deleteToken } = require('../services/tokenService');
const emailWithNodemailer = require('../helpers/email');
const crypto = require('crypto');

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
    var otp
    if (req.headers.authorization) {
      otp = req.headers.authorization.split(' ')[1];
    }
    if (!otp) {
      const existingOTP = await checkOTPByEmail(email);
      if (existingOTP) {
        console.log('OTP already exists', existingOTP);
        return res.status(409).json(response({ status: 'Error', statusCode: '409', type: 'user', message: req.t('otp-exists'), data: null }));
      }
      const otpData = await sendOTP(fullName, email, 'email', 'email-verification');
      if (otpData) {
        return res.status(200).json(response({ status: 'Error', statusCode: '200', type: 'user', message: req.t('otp-sent'), data: null }));
      }
    }
    else{
      const otpData = await verifyOTP(email, 'email', 'email-verification', otp);
      if (!otpData) {
        return res.status(400).json(response({ status: 'Error', statusCode: '400', type: 'user', message: req.t('invalid-otp') }));
      }
      const userData = {
        fullName: fullName,
        email: email,
        phoneNumber: phoneNumber,
        password: password,
        role: role,
      }
      const registeredUser = await addUser(userData);

      return res.status(200).json(response({ status: 'OK', statusCode: '200', type: 'user', message: req.t('user-verified'), data: registeredUser }));
    }
  } catch (error) {
    console.error(error);
    logger.error(error, req.originalUrl)
    return res.status(500).json(response({ status: 'Error', statusCode: '500', type: 'user', message: req.t('server-error') }));
  }
};

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
      var token;
      if (user.role === 'user') {
        token = crypto.randomBytes(32).toString('hex');
        const data = {
          token: token,
          userId: user._id
        }
        await addToken(data);
      }
      else {
        token = jwt.sign({ _id: user._id, email: user.email, role: user.role }, process.env.JWT_ACCESS_TOKEN, { expiresIn: '30d' });
      }
      return res.status(200).json(response({ statusCode: 200, message: req.t('login-success'), status: "OK", type: "user", data: user, token: token }));
    }
    return res.status(401).json(response({ statusCode: 200, message: req.t('login-failed'), status: "OK" }));

  } catch (error) {
    console.error(error);
    logger.error(error, req.originalUrl)
    return res.status(500).json(response({ statusCode: 200, message: req.t('server-error'), status: "Error" }));
  }
};

const forgetPassword = async (req, res) => {
  try {
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
  catch (error) {
    console.error(error);
    logger.error(error, req.originalUrl)
    return res.status(500).json(response({ statusCode: 200, message: req.t('server-error'), status: "Error" }));
  }
}

const verifyForgetPasswordOTP = async (req, res) => {
  try {
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
  catch (error) {
    console.error(error);
    logger.error(error, req.originalUrl)
    return res.status(500).json(response({ statusCode: 200, message: req.t('server-error'), status: "Error" }));
  }
}

const resetPassword = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await getUserByEmail(email);
    if (!user) {
      return res.status(404).json(response({ status: 'Error', statusCode: '404', type: 'user', message: req.t('user-not-exists') }));
    }
    const otpVerified = await checkOTPValidity(email);
    if (!otpVerified) {
      return res.status(400).json(response({ status: 'Error', statusCode: '400', type: 'user', message: req.t('otp-expired') }));
    }
    const isValidPassword = validatePassword(password);
    if (!isValidPassword) {
      return res.status(400).json(response({ status: 'Error', statusCode: '400', type: 'user', message: req.t('password-format-error') }));
    }

    const passwordAfterHassed = hashedPassword(password);
    user.password = passwordAfterHassed;
    await user.save();
    await updateOTP(otpVerified._id, 'expired');
    return res.status(200).json(response({ status: 'OK', statusCode: '200', type: 'user', message: req.t('password-reset-success') }));
  }
  catch (error) {
    console.error(error);
    logger.error(error, req.originalUrl)
    return res.status(500).json(response({ statusCode: 200, message: req.t('server-error'), status: "Error" }));
  }
}

const addWorker = async (req, res) => {
  try {
    const { fullName, email, phoneNumber } = req.body;
    if (req.body.userRole !== 'admin') {
      return res.status(401).json(response({ statusCode: 401, message: req.t('unauthorised'), status: "Error" }));
    }
    const existingUser = await getUserByEmail(email);
    if (existingUser) {
      return res.status(409).json(response({ status: 'Error', statusCode: '409', type: 'user', message: req.t('user-exists') }));
    }
    const length = 8;
    // Generate a random password
    const password = crypto.randomBytes(length).toString('hex').slice(0, length);
    const user = {
      fullName,
      email,
      phoneNumber,
      password,
      role:"worker"
    };
    const userSaved = await addUser(user);
    if (userSaved) {

      const subject = 'Worker login credentials for Russend';
      const url = 'http://localhost:3000/login'
      const emailData = {
        email: email,
        subject: subject,
        html: `
        <h3>Welcome ${fullName} to Russend as Co-Worker</h3>
        <p><b>Your login credentials:</b></p>
        <hr>
        <table>
          <tr>
            <th align="left">Email:</th>
            <td>${email}</td>
          </tr>
          <tr>
            <th align="left">Password:</th>
            <td>${password}</td>
          </tr>
        </table>
        <p>To login, <a href=${url}>Click here</a></p>`
      }
      await emailWithNodemailer(emailData);
      return res.status(200).json(response({ status: 'OK', statusCode: '201', type: 'user', message: req.t('worker-added'), data: userSaved }));
    }
    return res.status(400).json(response({ status: 'Error', statusCode: '400', type: 'user', message: req.t('worker-not-added') }));
  }
  catch (error) {
    console.error(error);
    logger.error(error, req.originalUrl)
    return res.status(500).json(response({ statusCode: 200, message: req.t('server-error'), status: "Error" }));
  }
}

const getUsers = async (req, res) => {
  try {
    if (req.body.userRole !== 'admin') {
      return res.status(401).json(response({ statusCode: 401, message: req.t('unauthorised'), status: "Error" }));
    }
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const filter = {
      role: 'user'
    };
    const options = { page, limit };
    const { userList, pagination } = await getAllUsers(filter, options);
    return res.status(200).json(response({ status: 'OK', statusCode: '200', type: 'user', message: req.t('user-list'), data: { userList, pagination } }));
  }
  catch (error) {
    console.error(error);
    logger.error(error, req.originalUrl)
    return res.status(500).json(response({ statusCode: 200, message: req.t('server-error'), status: "Error" }));
  }
}

const getWorkers = async (req, res) => {
  try {
    if (req.body.userRole !== 'admin') {
      return res.status(401).json(response({ statusCode: 401, message: req.t('unauthorised'), status: "Error" }));
    }
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const filter = {
      role: 'worker'
    };
    const options = { page, limit };
    const { userList, pagination } = await getAllUsers(filter, options);
    return res.status(200).json(response({ status: 'OK', statusCode: '200', type: 'user', message: req.t('worker-list'), data: { userList, pagination } }));
  }
  catch (error) {
    console.error(error);
    logger.error(error, req.originalUrl)
    return res.status(500).json(response({ statusCode: 200, message: req.t('server-error'), status: "Error" }));
  }
}

const userDetails = async (req, res) => {
  try {
    const id = req.params.id;
    const userDetails = await getUserById(id);
    return res.status(200).json(response({ statusCode: 200, message: req.t('user-details'), data: userDetails, status: "OK" }));
  }
  catch (error) {
    console.error(error);
    logger.error(error, req.originalUrl)
    return res.status(500).json(response({ statusCode: 200, message: req.t('server-error'), status: "Error" }));
  }
}

const addPasscode = async (req, res) => {
  try {
    const clientId = req.body.clientId;
    const passcode = req.body.passcode;
    const userData = await getUserById(clientId);
    if (!userData) {
      return res.status(404).json(response({ status: 'Error', statusCode: '404', type: 'user', message: req.t('user-not-exists') }));
    }
    if (userData.role !== 'user') {
      return res.status(400).json(response({ status: 'Error', statusCode: '400', type: 'user', message: req.t('unauthorised') }));
    }
    userData.passcode = passcode;
    await userData.save();
    return res.status(200).json(response({ status: 'OK', statusCode: '200', type: 'user', message: req.t('passcode-added'), data: userData }));
  }
  catch (error) {
    console.error(error);
    logger.error(error, req.originalUrl)
    return res.status(500).json(response({ statusCode: 200, message: req.t('server-error'), status: "Error" }));
  }

}

const verifyPasscode = async (req, res) => {
  try {
    var token
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    }
    const tokenData = await verifyToken(token);
    if (!tokenData) {
      return res.status(404).json(response({ status: 'Error', statusCode: '404', type: 'user', message: req.t('invalid-token') }));
    }
    const { passcode } = req.body;
    if (passcode && tokenData.userId.passcode !== passcode) {
      return res.status(400).json(response({ status: 'Error', statusCode: '400', type: 'user', message: req.t('unauthorised') }));
    }
    const accessToken = jwt.sign({ _id: tokenData.userId._id, email: tokenData.userId.email, role: tokenData.userId.role }, process.env.JWT_ACCESS_TOKEN, { expiresIn: '30d' });
    await deleteToken(tokenData._id);
    return res.status(200).json(response({ status: 'OK', statusCode: '200', type: 'user', message: req.t('passcode-verfied'), token: accessToken }));
  }
  catch (error) {
    console.error(error);
    logger.error(error, req.originalUrl)
    return res.status(500).json(response({ statusCode: 200, message: req.t('server-error'), status: "OK" }));
  }
}


module.exports = { signUp, signIn, forgetPassword, verifyForgetPasswordOTP, resetPassword, addWorker, getWorkers, getUsers, userDetails, resetPassword, verifyForgetPasswordOTP, forgetPassword, forgetPassword, verifyPasscode, addPasscode, verifyPasscode }