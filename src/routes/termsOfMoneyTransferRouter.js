const express = require('express');
const { upgradeTermsOfMoneyTransfer, getAllTermsOfMoneyTransfers } = require('../controllers/termsOfMoneyTransferController');
const router = express.Router();
const { isValidUser } = require('../middlewares/auth')
const validatePolicy = require('../middlewares/policies/policyValidation');

router.post('/',  isValidUser, validatePolicy, upgradeTermsOfMoneyTransfer);
router.get('/', getAllTermsOfMoneyTransfers);

module.exports = router;