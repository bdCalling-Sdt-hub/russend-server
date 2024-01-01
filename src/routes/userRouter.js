const express = require('express');
const { signUp, signIn } = require('../controllers/userController');
const router = express.Router();
const userFileUploadMiddleware = require("../middlewares/fileUpload");

const UPLOADS_FOLDER_USERS = "./public/uploads/users";
const uploadUsers = userFileUploadMiddleware(UPLOADS_FOLDER_USERS);
const { isValidUser } = require('../middlewares/auth')
const  validationMiddleware = require('../middlewares/user/signupValidation');

//Sign-up user
router.post('/sign-up',  validationMiddleware, signUp);
router.post('/sign-in', signIn);


module.exports = router;