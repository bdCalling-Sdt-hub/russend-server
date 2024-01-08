const express = require('express');
const { upgradePersonalDataPolicy, getAllPersonalDataPolicys } = require('../controllers/personalDataPolicyController');
const router = express.Router();
const { isValidUser } = require('../middlewares/auth')

router.post('/',  isValidUser, upgradePersonalDataPolicy);
router.get('/', getAllPersonalDataPolicys);

module.exports = router;