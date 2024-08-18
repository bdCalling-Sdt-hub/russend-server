const express = require('express');
const router = express.Router();
const { addTransactionController, getAllTransactions, getTransactionById, updateTransactionToSent, cancelTransaction, getTransactionChart, getTransactionCounts, getTransactionHistory, confirmTransactionByUser } = require('../controllers/transactionController');
const { isValidUser } = require('../middlewares/auth')
const validateTransaction = require('../middlewares/transaction/transactionValidation');

router.post('/', isValidUser, validateTransaction, addTransactionController);
router.get('/chart', isValidUser, getTransactionChart);
router.get('/counts', isValidUser, getTransactionCounts);
router.get('/history', isValidUser, getTransactionHistory);
router.get('/:id', isValidUser, getTransactionById);
router.get('/', isValidUser, getAllTransactions);
router.patch('/confirm/:id', isValidUser, confirmTransactionByUser);
router.patch('/transfer/:id', isValidUser, updateTransactionToSent);
router.patch('/cancel/:id', isValidUser, cancelTransaction);

module.exports = router;