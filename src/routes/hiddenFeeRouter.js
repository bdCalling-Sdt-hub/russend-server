const express = require('express');
const { upgradeHiddenFee, getAllHiddenFee } = require('../controllers/hiddenFeeController');
const router = express.Router();
const { isValidUser } = require('../middlewares/auth')

router.post('/', isValidUser, upgradeHiddenFee);
router.get('/', getAllHiddenFee);

module.exports = router;