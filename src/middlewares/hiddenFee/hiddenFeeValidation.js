const User = require('../../models/User');
const response = require('../../helpers/response');
const logger = require('../../helpers/logger');

const validateHiddenFee = async (req, res, next) => {
  try {
    const { phoneNumber, bankName, name } = req.body;
    let errors = [];

    if (!name) {
      errors.push({ field: 'name', message: req.t('name-required') });
    }
    if (!bankName) {
      errors.push({ field: 'bankName', message: req.t('bankName-required') });
    }
    if (!phoneNumber) {
      errors.push({ field: 'phoneNumber', message: req.t('phoneNumber-required') });
    }

    if (Object.keys(errors).length !== 0) {
      logger.error('Sign up validation error', '--> hidden fee middleware');
      return res.status(422).json(response({ status: 'Error', statusCode: '422', type: "hiddenFee", message: req.t('validation-error'), errors: errors }));
    }
    next(); // Continue to the next middleware or route handler
  }
  catch (error) {
    logger.error(error, req.originalUrl);
    console.error(error);
  }
};


module.exports = validateHiddenFee;
