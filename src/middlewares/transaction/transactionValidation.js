const User = require('../../models/User');
const response = require('../../helpers/response');
const logger = require('../../helpers/logger');

const validateTransaction = async (req, res, next) => {
  try {
    const { firstName, lastName, phoneNumber, amountToSent, ammountToSentCurrency, amountToReceive, amountToReceiveCurrency, exchangeRate, hiddenFees, paymentMethod,  } = req.body;
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
    if (typeof amountToSent !== 'number' || amountToSent < 0) {
      errors.push({ field: 'amountToSent', message: req.t('amountToSent-format-error') });
    }
    if (!ammountToSentCurrency) {
      errors.push({ field: 'ammountToSentCurrency', message: req.t('ammountToSentCurrency-required') });
    }
    if (typeof amountToReceive !== 'number' || amountToReceive < 0) {
      errors.push({ field: 'amountToReceive', message: req.t('amountToReceive-format-error') });
    }
    if (!amountToReceiveCurrency) {
      errors.push({ field: 'amountToReceiveCurrency', message: req.t('amountToReceiveCurrency-required') });
    }
    if (typeof exchangeRate !== 'number' || exchangeRate < 0) {
      errors.push({ field: 'exchangeRate', message: req.t('exchangeRate-format-error') });
    }
    if (typeof hiddenFees !== 'number' || hiddenFees < 0 || hiddenFees > 100) {
      errors.push({ field: 'hiddenFees', message: req.t('hiddenFees-format-error') });
    }
    if (!paymentMethod) {
      errors.push({ field: 'paymentMethod', message: req.t('paymentMethod-required') });
    }
    if (Object.keys(errors).length !== 0) {
      logger.error('Sign up validation error', req.originalUrl);
      return res.status(422).json(response({ status: 'Error', statusCode: '422', type: "hiddenFee", message: req.t('validation-error'), errors: errors }));
    }
    next(); // Continue to the next middleware or route handler
  }
  catch (error) {
    logger.error(error, req.originalUrl);
    console.error(error);
  }
};


module.exports = validateTransaction;
