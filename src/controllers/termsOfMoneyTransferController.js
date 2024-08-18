require('dotenv').config();
const response = require("../helpers/response");
const logger = require("../helpers/logger");
const { addTermsOfMoneyTransfer, getTermsOfMoneyTransfers } = require('../services/termsOfMoneyTransferService');

const upgradeTermsOfMoneyTransfer = async (req, res) => {
  try{
    if(req.body.userRole!=='admin'){
      return res.status(400).json(response({ status: 'Error', statusCode: '400', type: 'termsOfMoneyTransfer', message: req.t('unauthorised') }));
    }
    const termsOfMoneyTransfer = await addTermsOfMoneyTransfer(req.body);
    return res.status(201).json(response({ status: 'Success', statusCode: '201', type: 'termsOfMoneyTransfer', message: req.t('termsOfMoneyTransfer-added'), data: termsOfMoneyTransfer }));
  }
  catch(error){
    console.error(error);
    logger.error(error.message, req.originalUrl);
    return res.status(500).json(response({ status: 'Error', statusCode: '500', type: 'termsOfMoneyTransfer', message: req.t('server-error') }));
  }
}

const getAllTermsOfMoneyTransfers = async (req, res) => {
  try{
    const termsOfMoneyTransfers = await getTermsOfMoneyTransfers();
    return res.status(200).json(response({ status: 'Success', statusCode: '200', message: req.t('termsOfMoneyTransfers'), data: termsOfMoneyTransfers }));
  }
  catch(error){
    console.error(error);
    logger.error(error.message, req.originalUrl);
    return res.status(500).json(response({ status: 'Error', statusCode: '500', type: 'termsOfMoneyTransfer', message: req.t('server-error') }));
  }
}

module.exports = { upgradeTermsOfMoneyTransfer, getAllTermsOfMoneyTransfers }