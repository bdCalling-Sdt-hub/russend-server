require('dotenv').config();
const response = require("../helpers/response");
const logger = require("../helpers/logger");
const { getCountries } = require("../services/countryService");

const getAllCountries = async (req, res) => {
  try {
    const countries = await getCountries();
    return res.status(200).json(response({ status: 'Success', statusCode: '200', message: req.t('countries'), data: countries }));
  }
  catch (error) {
    console.error(error);
    logger.error(error.message, req.originalUrl);
    return res.status(500).json(response({ status: 'Error', statusCode: '500', type: 'hiddenFee', message: req.t('server-error') }));
  }
}

module.exports = { getAllCountries }