const express = require('express');
const { signUp, signIn, addWorker, getUsers, getWorkers, userDetails, forgetPassword, verifyForgetPasswordOTP, resetPassword, addPasscode, verifyPasscode, changePassword, blockUser, unBlockUser } = require('../controllers/userController');
const router = express.Router();
const userFileUploadMiddleware = require("../middlewares/fileUpload");

const UPLOADS_FOLDER_USERS = "./public/uploads/users";
const uploadUsers = userFileUploadMiddleware(UPLOADS_FOLDER_USERS);
const { isValidUser } = require('../middlewares/auth')
const  validationMiddleware = require('../middlewares/user/signupValidation');

//Sign-up user
router.post('/sign-up',  validationMiddleware, signUp);
router.post('/passcode', addPasscode);
router.post('/sign-in', signIn);
router.post('/verify-passcode', verifyPasscode);
router.post('/forget-password', forgetPassword);
router.post('/verify-otp', verifyForgetPasswordOTP);
router.post('/reset-password', resetPassword);
router.get('/', isValidUser, getUsers);
router.post('/workers', isValidUser, addWorker);
router.get('/workers', isValidUser, getWorkers)
router.patch('/block-user/:id', isValidUser, blockUser);
router.patch('/unblock-user/:id', isValidUser, unBlockUser);
router.get('/:id', isValidUser, userDetails);
router.patch('/change-password', isValidUser, changePassword);

module.exports = router;