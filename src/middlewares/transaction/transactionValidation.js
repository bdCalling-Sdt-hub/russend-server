const response = require('../../helpers/response');
const logger = require('../../helpers/logger');

const validateTransaction = async (req, res, next) => {
  try {
    const { firstName, lastName, phoneNumber, amountToSent, ammountToSentCurrency, amountToReceive, amountToReceiveCurrency, hiddenFees, paymentMethod, country  } = req.body;
    let errors = [];

    if (!firstName) {
      errors.push({ field: 'firstName', message: req.t('firstName-required') });
    }
    if (!lastName) {
      errors.push({ field: 'lastName', message: req.t('lastName-required') });
    }
    if (!phoneNumber) {
      errors.push({ field: 'phoneNumber', message: req.t('phoneNumber-required') });
    }
    if (Number(amountToSent) < 0) {
      errors.push({ field: 'amountToSent', message: req.t('amountToSent-format-error') });
    }
    if (!ammountToSentCurrency) {
      errors.push({ field: 'ammountToSentCurrency', message: req.t('ammountToSentCurrency-required') });
    }
    if (Number(amountToReceive) < 0) {
      errors.push({ field: 'amountToReceive', message: req.t('amountToReceive-format-error') });
    }
    if (!amountToReceiveCurrency) {
      errors.push({ field: 'amountToReceiveCurrency', message: req.t('amountToReceiveCurrency-required') });
    }
    if (Number(hiddenFees) < -100 || Number(hiddenFees) > 100) {
      errors.push({ field: 'hiddenFees', message: req.t('hiddenFees-format-error') });
    }
    if (!paymentMethod) {
      errors.push({ field: 'paymentMethod', message: req.t('paymentMethod-required') });
    }
    if (!country) {
      errors.push({ field: 'country', message: req.t('country-required') });
    }
    if (Object.keys(errors).length !== 0) {
      logger.error('Sign up validation error', req.originalUrl);
      return res.status(422).json(response({ status: 'Error', statusCode: '422', type: "hiddenFee", message: req.t('validation-error'), errors: errors }));
    }
    req.body.amountToReceive = Number(amountToReceive);
    req.body.amountToSent = Number(amountToSent);
    req.body.hiddenFees = Number(hiddenFees);
    next(); // Continue to the next middleware or route handler
  }
  catch (error) {
    logger.error(error, req.originalUrl);
    console.error(error);
  }
};


module.exports = validateTransaction;
