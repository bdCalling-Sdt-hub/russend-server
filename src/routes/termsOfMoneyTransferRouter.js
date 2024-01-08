const express = require('express');
const { upgradeTermsOfMoneyTransfer, getAllTermsOfMoneyTransfers } = require('../controllers/termsOfMoneyTransferController');
const router = express.Router();
const { isValidUser } = require('../middlewares/auth')

router.post('/',  isValidUser, upgradeTermsOfMoneyTransfer);
router.get('/', getAllTermsOfMoneyTransfers);

module.exports = router;