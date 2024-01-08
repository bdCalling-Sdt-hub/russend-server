const express = require('express');
const { upgradeRefundAndCancellationPolicy, getAllRefundAndCancellationPolicys } = require('../controllers/refundAndCancellationPolicyController');
const router = express.Router();
const { isValidUser } = require('../middlewares/auth')

router.post('/',  isValidUser, upgradeRefundAndCancellationPolicy);
router.get('/', getAllRefundAndCancellationPolicys);

module.exports = router;