const User = require('../../models/User');
const response = require('../../helpers/response');
const logger = require('../../helpers/logger');

const validatePaymentInfo = async (req, res, next) => {
  try {
    const { percentage, isActive } = req.body;
    let errors = [];
    console.log(req.body);

    // Validate percentage
    if (typeof percentage !== 'number' || percentage < 0 || percentage > 100) {
      errors.push({ field: 'percentage', message: req.t('percentage-invalid-range') });
    }

    // Validate isActive
    if (typeof isActive !== 'boolean') {
      errors.push({ field: 'isActive', message: req.t('isActive-invalid-type') });
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


module.exports = validatePaymentInfo;
