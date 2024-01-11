const { verify } = require('jsonwebtoken');
const Token = require('../models/Token');
const { set } = require('mongoose');

const addToken = async (tokenBody) => {
  try {
    var token = await verifyToken(tokenBody.token);
    if (token) {
      token.passcodeToken = tokenBody.token;
    }
    else {
      token = new Token({
        passcodeToken: tokenBody.token,
        userId: tokenBody.userId,
        purpose: tokenBody.purpose
      });
    }
    const data = await token.save();
    setTimeout(async () => {
      await deleteToken(data._id);
    }, 180000);//delete token after 3 minutes
    return token;
  } catch (error) {
    throw error;
  }

}

const verifyToken = async (token, purpose) => {
  try {
    const tokenObj = await Token.findOne({ passcodeToken: token, purpose: purpose }).populate('userId');
    if (tokenObj) {
      return tokenObj;
    }
    else {
      return null;
    }
  } catch (error) {
    throw error;
  }
}

const deleteToken = async (tokenId) => {
  try {
    return await Token.findByIdAndDelete(tokenId);
  } catch (error) {
    throw error;
  }
}

module.exports = {
  addToken,
  verifyToken,
  deleteToken
}