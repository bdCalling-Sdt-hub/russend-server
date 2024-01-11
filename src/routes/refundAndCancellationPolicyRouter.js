const express = require('express');
const { upgradeRefundAndCancellationPolicy, getAllRefundAndCancellationPolicys } = require('../controllers/refundAndCancellationPolicyController');
const router = express.Router();
const { isValidUser } = require('../middlewares/auth')
const validatePolicy = require('../middlewares/policies/policyValidation');

router.post('/',  isValidUser, validatePolicy, upgradeRefundAndCancellationPolicy);
router.get('/', getAllRefundAndCancellationPolicys);

module.exports = router;