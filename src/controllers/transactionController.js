const { addTransaction, getAllTransactions, getTransactionById } = require('../services/transactionService')
const response = require('../helpers/response')
const logger = require('../helpers/logger')

const addTransactionController = async (req, res) => {
  try {
    if(req.body.userRole!=='user'){
      res.status(400).json(response({ status: 'Error', statusCode: '400', type: 'transaction', message: req.t('unauthorised') }));
    }
    const transaction = await addTransaction(req.body);
    return res.status(201).json(response({ status: 'Success', statusCode: '201', type: 'transaction', message: req.t('transaction-added'), data: transaction }));
  } catch (error) {
    console.error(error);
    logger.error(error.message, req.originalUrl);
    return res.status(500).json(response({ status: 'Error', statusCode: '500', type: 'transaction', message: req.t('server-error') }));
  }
}

const getAllTransactions = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;

    const options = {
      page, limit
    }

    const filter = {};
    if(req.body.userRole==='user'){
      filter.sender = req.body.userId;
    }
    const { transactionList, pagination } = await getAllTransactions(filter, options);
    return res.status(200).json(response({ status: 'Success', statusCode: '200', type: 'transaction', message: req.t('transaction-list'), data: { transactionList, pagination } }));
  } catch (error) {
    console.error(error);
    logger.error(error.message, req.originalUrl);
    return res.status(500).json(response({ status: 'Error', statusCode: '500', type: 'transaction', message: req.t('server-error') }));
  }
}

const getTransactionById = async (req, res) => {
  try {
    const transaction = await getTransactionById(req.params.id);
    return res.status(201).json(response({ status: 'Success', statusCode: '201', message: req.t('transactionAdded'), data: transaction }));
  } catch (error) {
    console.error(error);
    logger.error(error.message, req.originalUrl);
    return res.status(500).json(response({ status: 'Error', statusCode: '500', type: 'transaction', message: req.t('server-error') }));
  }
}

const updateTransaction = async (req, res) => {
  try {
    const transaction = await updateTransaction(req.params.id, req.body);
    return res.status(201).json(response({ status: 'Success', statusCode: '201', type: 'transaction', message: req.t('transactionAdded'), data: transaction }));
  } catch (error) {
    console.error(error);
    logger.error(error.message, req.originalUrl);
    return res.status(500).json(response({ status: 'Error', statusCode: '500', type: 'transaction', message: req.t('server-error') }));
  }
}

module.exports = { addTransactionController, getAllTransactions, getTransactionById, updateTransaction }