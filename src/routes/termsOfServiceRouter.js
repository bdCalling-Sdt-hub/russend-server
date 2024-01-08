const express = require('express');
const { upgradeTermsOfService, getAllTermsOfServices } = require('../controllers/termsOfServicesController');
const router = express.Router();
const { isValidUser } = require('../middlewares/auth')

router.post('/',  isValidUser, upgradeTermsOfService);
router.get('/', getAllTermsOfServices);

module.exports = router;