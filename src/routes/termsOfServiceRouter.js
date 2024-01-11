const express = require('express');
const { upgradeTermsOfService, getAllTermsOfServices } = require('../controllers/termsOfServicesController');
const router = express.Router();
const { isValidUser } = require('../middlewares/auth')
const validatePolicy = require('../middlewares/policies/policyValidation');

router.post('/',  isValidUser, validatePolicy, upgradeTermsOfService);
router.get('/', getAllTermsOfServices);

module.exports = router;