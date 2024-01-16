const { addTransaction, allTransactions, transactionDetailsById, transactionCounts, transactionChart, updateTransactionById } = require('../services/transactionService')
const response = require('../helpers/response')
const logger = require('../helpers/logger')

const addTransactionController = async (req, res) => {
  try {
    if(req.body.userRole!=='user'){
      res.status(400).json(response({ status: 'Error', statusCode: '400', type: 'transaction', message: req.t('unauthorised') }));
    }
    const transaction = await addTransaction(req.body, req.body.userId);
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
    const { transactionList, pagination } = await allTransactions(filter, options);
    return res.status(200).json(response({ status: 'Success', statusCode: '200', type: 'transaction', message: req.t('transaction-list'), data: { transactionList, pagination } }));
  } catch (error) {
    console.error(error);
    logger.error(error.message, req.originalUrl);
    return res.status(500).json(response({ status: 'Error', statusCode: '500', type: 'transaction', message: req.t('server-error') }));
  }
}

const getTransactionById = async (req, res) => {
  try {
    const transaction = await transactionDetailsById(req.params.id);
    return res.status(201).json(response({ status: 'Success', statusCode: '201', message: req.t('transactionAdded'), data: transaction }));
  } catch (error) {
    console.error(error);
    logger.error(error.message, req.originalUrl);
    return res.status(500).json(response({ status: 'Error', statusCode: '500', type: 'transaction', message: req.t('server-error') }));
  }
}

const updateTransaction = async (req, res) => {
  try {
    if(req.body.userRole==='user'){
      res.status(400).json(response({ status: 'Error', statusCode: '400', type: 'transaction', message: req.t('unauthorised') }));
    }
    const transaction = await transactionDetailsById(req.params.id);
    if(!transaction.status){
      return res.status(400).json(response({ status: 'Error', statusCode: '400', type: 'transaction', message: req.t('transaction-not-found') }));
    }
    const updatedTransaction = await updateTransactionById(req.params.id, req.body);
    return res.status(201).json(response({ status: 'Success', statusCode: '201', type: 'transaction', message: req.t('transaction-updated'), data: updatedTransaction }));
  } catch (error) {
    console.error(error);
    logger.error(error.message, req.originalUrl);
    return res.status(500).json(response({ status: 'Error', statusCode: '500', type: 'transaction', message: req.t('server-error') }));
  }
}

const getTransactionCounts = async (req, res) => {
  try {
    const { totalTransactions, approvedTransactions, pendingTransactions } = await transactionCounts();
    return res.status(201).json(response({ status: 'Success', statusCode: '201', type: 'transaction', message: req.t('transaction-counts'), data: { totalTransactions, approvedTransactions, pendingTransactions } }));
  } catch (error) {
    console.error(error);
    logger.error(error.message, req.originalUrl);
    return res.status(500).json(response({ status: 'Error', statusCode: '500', type: 'transaction', message: req.t('server-error') }));
  }
}

const getTransactionChart = async (req, res) => {
  try {
    const year = Number(req.query.year) || new Date().getFullYear();
    console.log(year);
    const data = await transactionChart(year);
    return res.status(201).json(response({ status: 'Success', statusCode: '201', type: 'transaction', message: req.t('transaction-chart'), data: data }));
  } catch (error) {
    console.error(error);
    logger.error(error.message, req.originalUrl);
    return res.status(500).json(response({ status: 'Error', statusCode: '500', type: 'transaction', message: req.t('server-error') }));
  }
}

module.exports = { addTransactionController, getAllTransactions, getTransactionById, updateTransaction, getTransactionCounts, getTransactionChart }