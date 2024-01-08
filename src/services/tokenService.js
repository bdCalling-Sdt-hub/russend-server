const { verify } = require('jsonwebtoken');
const Token = require('../models/Token');

const addToken = async (tokenBody) => {
  try {
    var token = await verifyToken(tokenBody.token);
    if (token) {
      token.token = tokenBody.token;
    }
    else {
      token = new Token({
        token: tokenBody.token,
        userId: tokenBody.userId
      });
    }
    await token.save();
    return token;
  } catch (error) {
    throw error;
  }

}

verifyToken = async (token) => {
  try {
    const tokenObj = await Token.findOne({ token: token }).populate('userId');
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

deleteToken = async (tokenId) => {
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