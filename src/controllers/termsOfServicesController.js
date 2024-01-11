require('dotenv').config();
const response = require("../helpers/response");
const logger = require("../helpers/logger");
const { addTermsOfService, getTermsOfServices } = require('../services/termsOfServicesService');

const upgradeTermsOfService = async (req, res) => {
  try{
    if(req.body.userRole!=='admin'){
      res.status(400).json(response({ status: 'Error', statusCode: '400', type: 'termsOfService', message: req.t('unauthorised') }));
    }
    const termsOfService = await addTermsOfService(req.body);
    return res.status(201).json(response({ status: 'Success', statusCode: '201', type: 'termsOfService', message: req.t('termsOfService-added'), data: termsOfService }));
  }
  catch(error){
    console.error(error);
    logger.error(error.message, req.originalUrl);
    return res.status(500).json(response({ status: 'Error', statusCode: '500', type: 'termsOfService', message: req.t('server-error') }));
  }
}

const getAllTermsOfServices = async (req, res) => {
  try{
    const termsOfServices = await getTermsOfServices();
    return res.status(200).json(response({ status: 'Success', statusCode: '200', message: req.t('termsOfServices'), data: termsOfServices }));
  }
  catch(error){
    console.error(error);
    logger.error(error.message, req.originalUrl);
    return res.status(500).json(response({ status: 'Error', statusCode: '500', type: 'termsOfService', message: req.t('server-error') }));
  }
}

module.exports = { upgradeTermsOfService, getAllTermsOfServices }