const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const userSchema = new mongoose.Schema({
  fullName: { type: String, required: [true, 'Name is must be given'], trim: true },
  email: {
    type: String,
    required: [true, 'Email is required'],
    trim: true,
    unique: [true, 'Email should be unique'],
    lowercase: true,
    validate: {
      validator: function (v) {
        return /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(v);
      },
      message: 'Please enter a valid Email'
    }
  },
  phoneNumber: { type: String, required: false, trim: true },
  password: { type: String, required: [true, 'Password must be given'] },
  image: {
    type: Object, required: false, default: {
      publicFileUrl: `${process.env.IMAGE_UPLOAD_BACKEND_DOMAIN}/uploads/users/user.png`,
      path: 'public\\uploads\\users\\user.png'
    }
  },
  role: { type: String, enum: ['user', 'admin', 'worker'], default: 'user' },
  passcode: { type: String, required: false },
}, { timestamps: true }, {
  toJSON: {
    transform(doc, ret) {
      delete ret.password;
    },
  },
},

);

module.exports = mongoose.model('User', userSchema);