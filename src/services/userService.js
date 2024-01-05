const User = require('../models/User');
const bcrypt = require('bcryptjs');

const addUser = async (userBody) => {
  try {
    const user = new User(userBody);
    await user.save();
    return user;
  } catch (error) {
    throw error;
  }
}

const getUserById = async (id) => {
  return await User.findById(id);
}

const getUserByEmail = async (email) => {
  return await User.findOne({ email });
}

const login = async (email, password) => {
  
  const user = await User.findOne({ email });
  if (!user) {
    return null;
  }
  const isMatch = await bcrypt.compare(password, user.password);
  console.log("email", email, "password", password, "user", user, "isMatch", isMatch);
  if (!isMatch) {
    return null;
  }
  return user;
}

const updateUser = async (userId,userbody) => {
  const existingUser = await User.findById(userId);
  if (!existingUser) {
    throw new Error('User not found');
  }
  const user = new User(userbody);
  Object.assign(existingUser, user);
  await existingUser.save();
  return existingUser;
}

module.exports = {
  addUser,
  login,
  getUserById,
  updateUser,
  getUserByEmail
}
