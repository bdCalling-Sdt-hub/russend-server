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

const getAllUsers = async (filter, options) => {
  const {page=1, limit=10} = options;
  const skip = (page - 1) * limit;
  const userList = await User.find({...filter}).skip(skip).limit(limit).sort({createdAt: -1});
  const totalResults = await User.countDocuments({...filter});
  const totalPages = Math.ceil(totalResults / limit);
  const pagination = {totalResults, totalPages, currentPage: page, limit};
  return {userList, pagination};
}

const login = async (email, password) => {
  const user = await User.findOne({ email });
  if (!user) {
    return null;
  }
  const isMatch = await bcrypt.compare(password, user.password);
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
  getUserByEmail,
  getAllUsers
}
