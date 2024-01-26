const express = require('express');
const router = express.Router();
const { addTransactionController, getAllTransactions, getTransactionById, updateTransactionToSent, acceptTransaction, cancelTransaction, getTransactionChart, getTransactionCounts, getTransactionHistory } = require('../controllers/transactionController');
const { isValidUser } = require('../middlewares/auth')
const validateTransaction = require('../middlewares/transaction/transactionValidation');

router.post('/', isValidUser, validateTransaction, addTransactionController);
router.get('/chart', isValidUser, getTransactionChart);
router.get('/counts', isValidUser, getTransactionCounts);
router.get('/history', isValidUser, getTransactionHistory);
router.get('/:id', isValidUser, getTransactionById);
router.get('/', isValidUser, getAllTransactions);
router.patch('/transferrer/:id', isValidUser, updateTransactionToSent);
router.patch('/accept/:id', isValidUser, acceptTransaction);
router.patch('/cancel/:id', isValidUser, cancelTransaction);

module.exports = router;