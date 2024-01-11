require('dotenv').config();
const response = require("../helpers/response");
const logger = require("../helpers/logger");
const { addRefundAndCancellationPolicy, getRefundAndCancellationPolicys } = require('../services/refundAndCancellationPolicyService');

const upgradeRefundAndCancellationPolicy = async (req, res) => {
  try{
    if(req.body.userRole!=='admin'){
      res.status(400).json(response({ status: 'Error', statusCode: '400', type: 'refundAndCancellationPolicy', message: req.t('unauthorised') }));
    }
    const refundAndCancellationPolicy = await addRefundAndCancellationPolicy(req.body);
    return res.status(201).json(response({ status: 'Success', statusCode: '201', type: 'refundAndCancellationPolicy', message: req.t('refundAndCancellationPolicy-added'), data: refundAndCancellationPolicy }));
  }
  catch(error){
    console.error(error);
    logger.error(error.message, req.originalUrl);
    return res.status(500).json(response({ status: 'Error', statusCode: '500', type: 'refundAndCancellationPolicy', message: req.t('server-error') }));
  }
}

const getAllRefundAndCancellationPolicys = async (req, res) => {
  try{
    const refundAndCancellationPolicys = await getRefundAndCancellationPolicys();
    return res.status(200).json(response({ status: 'Success', statusCode: '200', message: req.t('refundAndCancellationPolicys'), data: refundAndCancellationPolicys }));
  }
  catch(error){
    console.error(error);
    logger.error(error.message, req.originalUrl);
    return res.status(500).json(response({ status: 'Error', statusCode: '500', type: 'refundAndCancellationPolicy', message: req.t('server-error') }));
  }
}

module.exports = { upgradeRefundAndCancellationPolicy, getAllRefundAndCancellationPolicys }