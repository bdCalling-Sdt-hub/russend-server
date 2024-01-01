const User = require('../models/User');

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
