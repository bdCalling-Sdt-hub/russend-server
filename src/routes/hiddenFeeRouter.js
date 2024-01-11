const express = require('express');
const { upgradeHiddenFee, getAllHiddenFee } = require('../controllers/hiddenFeeController');
const router = express.Router();
const { isValidUser } = require('../middlewares/auth')
const validateHiddenFee = require('../middlewares/hiddenFee/hiddenFeeValidation');

router.post('/', isValidUser, validateHiddenFee, upgradeHiddenFee);
router.get('/', getAllHiddenFee);

module.exports = router;