const express = require("express");
const {
  upgradePaymentInfo,
  getAllPaymentInfo,
} = require("../controllers/paymentInfoController");
const router = express.Router();
const { isValidUser } = require("../middlewares/auth");

router.post("/", isValidUser, upgradePaymentInfo);
router.get("/", getAllPaymentInfo);

module.exports = router;
