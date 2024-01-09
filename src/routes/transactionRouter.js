const express = require('express');
const router = express.Router();
const { addTransactionController, getAllTransactions, getTransactionById, updateTransaction, getTransactionChart, getTransactionCounts } = require('../controllers/transactionController');
const { isValidUser } = require('../middlewares/auth')

router.post('/',  isValidUser, addTransactionController);
router.get('/chart', isValidUser, getTransactionChart);
router.get('/counts', isValidUser, getTransactionCounts);
router.get('/:id', isValidUser, getTransactionById);
router.get('/', isValidUser, getAllTransactions);
router.put('/:id', isValidUser, updateTransaction);


module.exports = router;