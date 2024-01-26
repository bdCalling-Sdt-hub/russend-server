const express = require('express');
const { getAllNotifications, getNotificationDetails } = require('../controllers/notificationController');
const router = express.Router();
const { isValidUser } = require('../middlewares/auth')

router.get('/', isValidUser, getAllNotifications);
router.get('/:id', isValidUser, getNotificationDetails);

module.exports = router;