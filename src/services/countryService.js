const Country = require('../models/Country');

const getCountries = async () => {
  try {
    return await Country.find();
  }
  catch (error) {
    throw error;
  }
}

module.exports = {
  getCountries
}
