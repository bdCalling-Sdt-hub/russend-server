require('dotenv').config();
const response = require("../helpers/response");
const logger = require("../helpers/logger");
const { addPersonalDataPolicy, getPersonalDataPolicys } = require('../services/personalDataPolicyService');

const upgradePersonalDataPolicy = async (req, res) => {
  try{
    if(req.body.userRole!=='admin'){
      res.status(400).json(response({ status: 'Error', statusCode: '400', type: 'personalDataPolicy', message: req.t('unauthorised') }));
    }
    const personalDataPolicy = await addPersonalDataPolicy(req.body);
    return res.status(201).json(response({ status: 'Success', statusCode: '201', type: 'personalDataPolicy', message: req.t('personalDataPolicy-added'), data: personalDataPolicy }));
  }
  catch(error){
    console.error(error);
    logger.error(error.message, req.originalUrl);
    return res.status(500).json(response({ status: 'Error', statusCode: '500', type: 'personalDataPolicy', message: req.t('server-error') }));
  }
}

const getAllPersonalDataPolicys = async (req, res) => {
  try{
    const personalDataPolicys = await getPersonalDataPolicys();
    return res.status(200).json(response({ status: 'Success', statusCode: '200', message: req.t('personalDataPolicys'), data: personalDataPolicys }));
  }
  catch(error){
    console.error(error);
    logger.error(error.message, req.originalUrl);
    return res.status(500).json(response({ status: 'Error', statusCode: '500', type: 'personalDataPolicy', message: req.t('server-error') }));
  }
}

module.exports = { upgradePersonalDataPolicy, getAllPersonalDataPolicys }