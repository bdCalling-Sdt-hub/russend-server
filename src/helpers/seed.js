const mongoose = require('mongoose');
require('dotenv').config();
const User = require('../models/User');
const PaymentInfo = require('../models/PaymentInfo');
const Country = require('../models/Country');
const HiddenFee = require('../models/HiddenFee');

// Sample data
const usersData = [
  {
    "fullName": "Testing Admin",
    "email": "ad.residplus@gmail.com",
    "phoneNumber": "01735566789",
    "password": 'helloadmin',
    "role": "admin"
  },
  {
    "fullName": "Testing Worker",
    "email": "sub.residplus@gmail.com",
    "phoneNumber": "01933456040",
    "password": 'helloworker',
    "role": "worker"
  },
  {
    "fullName": "Testing Clinet",
    "email": "testing.client@gmail.com",
    "phoneNumber": "01734456873",
    "password": 'helloclient',
    "role": "user",
    "passcode": "1234"
  }
];

const paymentInfo = {
  "name": "Сбербанк (sberbank)",
  "phoneNumber": "+79050048977",
  "bankName": "ричард манни в",
}

const hiddenFee = {
  "percentage": 0,
  "isActive": false,
}

const countryData = [
  {
    "name": "Cameroon",
    "countryCode": "+237",
    "currency": "XAF",
    "countryFlag": process.env.IMAGE_UPLOAD_BACKEND_DOMAIN + "/uploads/flags/cameroon.svg",
    "paymentGateways": [{
      "name": "Orange Money",
      "logo": process.env.IMAGE_UPLOAD_BACKEND_DOMAIN + "/uploads/gateways/orange_money.png",
    },
    {
      "name": "MTN Mobile Money",
      "logo": process.env.IMAGE_UPLOAD_BACKEND_DOMAIN + "/uploads/gateways/mtn.png",
    }],
    "isPaymentAvailable": true,
  },
  {
    "name": "Gabon",
    "countryCode": "+241",
    "currency": "XAF",
    "countryFlag": process.env.IMAGE_UPLOAD_BACKEND_DOMAIN + "/uploads/flags/gabon.svg",
    "paymentGateways": [{
      "name": "Orange Money",
      "logo": process.env.IMAGE_UPLOAD_BACKEND_DOMAIN + "/uploads/gateways/orange_money.png",
    }],
    "isPaymentAvailable": true,
  },
  {
    "name": "Equatorial Guinea",
    "countryCode": "+240",
    "currency": "XAF",
    "countryFlag": process.env.IMAGE_UPLOAD_BACKEND_DOMAIN + "/uploads/flags/equatorial_guinea.svg",
    "paymentGateways": [{
      "name": "Orange Money",
      "logo": process.env.IMAGE_UPLOAD_BACKEND_DOMAIN + "/uploads/gateways/orange_money.png",
    }],
    "isPaymentAvailable": true,
  },
  {
    "name": "Repubilc of Congo",
    "countryCode": "+243",
    "currency": "XAF",
    "countryFlag": process.env.IMAGE_UPLOAD_BACKEND_DOMAIN + "/uploads/flags/congo.svg",
    "paymentGateways": [{
      "name": "Orange Money",
      "logo": process.env.IMAGE_UPLOAD_BACKEND_DOMAIN + "/uploads/gateways/orange_money.png",
    }],
    "isPaymentAvailable": true,
  },
  {
    "name": "Chad",
    "countryCode": "+235",
    "currency": "XAF",
    "countryFlag": process.env.IMAGE_UPLOAD_BACKEND_DOMAIN + "/uploads/flags/chad.svg",
    "paymentGateways": [{
      "name": "Orange Money",
      "logo": process.env.IMAGE_UPLOAD_BACKEND_DOMAIN + "/uploads/gateways/orange_money.png",
    }],
    "isPaymentAvailable": true,
  },
  {
    "name": "Central African R",
    "countryCode": "+236",
    "currency": "XAF",
    "countryFlag": process.env.IMAGE_UPLOAD_BACKEND_DOMAIN + "/uploads/flags/central_african.svg",
    "paymentGateways": [{
      "name": "Orange Money",
      "logo": process.env.IMAGE_UPLOAD_BACKEND_DOMAIN + "/uploads/gateways/orange_money.png",
    }],
    "isPaymentAvailable": true,
  },
  {
    "name": "Kaxakhatan",
    "countryCode": "+7",
    "currency": "KZT",
    "countryFlag": process.env.IMAGE_UPLOAD_BACKEND_DOMAIN + "/uploads/flags/kazakhstan.svg",
    "isPaymentAvailable": false,
  },
  {
    "name": "Tajikistan",
    "countryCode": "+992",
    "currency": "TJS",
    "countryFlag": process.env.IMAGE_UPLOAD_BACKEND_DOMAIN + "/uploads/flags/Tajikistan.svg",
    "isPaymentAvailable": false,
  },
  {
    "name": "Belarus",
    "countryCode": "+375",
    "currency": "BYN",
    "countryFlag": process.env.IMAGE_UPLOAD_BACKEND_DOMAIN + "/uploads/flags/belarus.svg",
    "isPaymentAvailable": false,
  },
];

// Function to drop the entire database
const dropDatabase = async () => {
  try {
    await mongoose.connection.dropDatabase();
    console.log('------------> Database dropped successfully! <------------');
  } catch (err) {
    console.error('Error dropping database:', err);
  }
};

// Function to seed users
const seedUsers = async () => {
  try {
    await User.deleteMany();
    await User.insertMany(usersData);
    console.log('Users seeded successfully!');
  } catch (err) {
    console.error('Error seeding users:', err);
  }
};

const seedHiddenFee = async () => { 
  try {
    await HiddenFee.deleteMany();
    await HiddenFee.create(hiddenFee);
    console.log('Hidden fee seeded successfully!');
  } catch (err) {
    console.error('Error seeding hidden fee:', err);
  }
}

const seedPaymentGateways = async () => {
  try {
    await Country.deleteMany();
    await Country.insertMany(countryData);
    console.log('Countries seeded successfully!');
  } catch (err) {
    console.error('Error seeding users:', err);
  }
};

const seedPaymentInfo = async () => {
  try {
    await PaymentInfo.deleteMany();
    await PaymentInfo.create(paymentInfo);
    console.log('Payment info seeded successfully!');
  } catch (err) {
    console.error('Error seeding payment info:', err);
  }
};

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_CONNECTION, {});

// Call seeding functions
const seedDatabase = async () => {
  try {
    await dropDatabase();
    await seedUsers();
    await seedPaymentInfo();
    await seedHiddenFee();
    await seedPaymentGateways();
    console.log('--------------> Database seeding completed <--------------');
  } catch (err) {
    console.error('Error seeding database:', err);
  } finally {
    mongoose.disconnect();
  }
};

// Execute seeding
seedDatabase();
