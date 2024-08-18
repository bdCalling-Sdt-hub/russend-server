require('dotenv').config();
const response = require("../helpers/response");
const logger = require("../helpers/logger");
const { addPaymentInfo, getPaymentInfo } = require('../services/paymentInfoService');

const upgradePaymentInfo = async (req, res) => {
  try{
    if(req.body.userRole!=='admin'){
      return res.status(400).json(response({ status: 'Error', statusCode: '400', type: 'paymentInfo', message: req.t('unauthorised') }));
    }
    const paymentInfo = await addPaymentInfo(req.body);
    return res.status(201).json(response({ status: 'Success', statusCode: '201', type: 'paymentInfo', message: req.t('paymentInfo-added'), data: paymentInfo }));
  }
  catch(error){
    console.error(error);
    logger.error(error.message, req.originalUrl);
    return res.status(500).json(response({ status: 'Error', statusCode: '500', type: 'paymentInfo', message: req.t('server-error') }));
  }
}

const getAllPaymentInfo = async (req, res) => {
  try{
    const paymentInfos = await getPaymentInfo();
    return res.status(200).json(response({ status: 'Success', statusCode: '200', message: req.t('paymentInfos'), data: paymentInfos }));
  }
  catch(error){
    console.error(error);
    logger.error(error.message, req.originalUrl);
    return res.status(500).json(response({ status: 'Error', statusCode: '500', type: 'paymentInfo', message: req.t('server-error') }));
  }
}

module.exports = { upgradePaymentInfo, getAllPaymentInfo }