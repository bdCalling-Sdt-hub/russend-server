const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const registrationSchema = new mongoose.Schema({
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
  password: { type: String, required: [true, 'Password must be given']},
  image: {
    type: Object, required: false, default: {
      publicFileUrl: `${process.env.IMAGE_UPLOAD_BACKEND_DOMAIN}/uploads/users/user.png`,
      path: 'public\\uploads\\users\\user.png'
    }
  },
  role: { type: String, enum: ['user', 'admin', 'worker'], default: 'user' },
  oneTimeCode: { type: String, required: false },
  status: { type: String, enum: ['accepted', 'banned', 'suspended', 'deleted'], default: 'accepted' },
}, { timestamps: true }, {
  toJSON: {
    transform(doc, ret) {
      delete ret.password;
    },
  },
});

const saltRounds = 10; // Define the number of salt rounds
registrationSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    const salt = await bcrypt.genSalt(saltRounds);
    this.password = await bcrypt.hash(this.password, salt);
  }
  next();
});
module.exports = mongoose.model('Registration', registrationSchema);