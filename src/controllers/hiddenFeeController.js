require('dotenv').config();
const response = require("../helpers/response");
const logger = require("../helpers/logger");
const { addHiddenFee, getHiddenFee } = require('../services/hiddenFeeService');

const upgradeHiddenFee = async (req, res) => {
  try{
    if(req.body.userRole!=='admin'){
      res.status(400).json(response({ status: 'Error', statusCode: '400', type: 'hiddenFee', message: req.t('unauthorised') }));
    }
    const hiddenFee = await addHiddenFee(req.body);
    return res.status(201).json(response({ status: 'Success', statusCode: '201', type: 'hiddenFee', message: req.t('hiddenFee-added'), data: hiddenFee }));
  }
  catch(error){
    console.error(error);
    logger.error(error.message, req.originalUrl);
    return res.status(500).json(response({ status: 'Error', statusCode: '500', type: 'hiddenFee', message: req.t('server-error') }));
  }
}

const getAllHiddenFee = async (req, res) => {
  try{
    const hiddenFees = await getHiddenFee();
    return res.status(200).json(response({ status: 'Success', statusCode: '200', message: req.t('hiddenFees'), data: hiddenFees }));
  }
  catch(error){
    console.error(error);
    logger.error(error.message, req.originalUrl);
    return res.status(500).json(response({ status: 'Error', statusCode: '500', type: 'hiddenFee', message: req.t('server-error') }));
  }
}

module.exports = { upgradeHiddenFee, getAllHiddenFee }