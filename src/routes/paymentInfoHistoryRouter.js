const express = require("express");

const router = express.Router();

const { isValidUser } = require("../middlewares/auth");
const {
  getPaymentInfoHistory,
} = require("../controllers/paymentInfoHistoryController");

router.get("", isValidUser, getPaymentInfoHistory);

module.exports = router;
