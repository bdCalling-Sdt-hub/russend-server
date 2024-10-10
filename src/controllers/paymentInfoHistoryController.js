const response = require("../helpers/response");
const paymnetInfoHistoryService = require("../services/PaymentInfoHistoryService");

const getPaymentInfoHistory = async (req, res) => {
  try {
    if (!(req.body.userRole === "admin" || req.body.userRole === "worker")) {
      return res.status(400).json(
        response({
          status: "Error",
          statusCode: "400",
          type: "Transaction",
          message: req.t("unauthorised"),
        })
      );
    }
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;

    const options = {
      page,
      limit,
    };

    const { paymentInfoList, pagination } =
      await paymnetInfoHistoryService.allPaymentHistoryInfo(options);

    return res.status(200).json(
      response({
        status: "Success",
        statusCode: "200",
        type: "Payment Info History",
        message: req.t("Payment-Info-list"),
        data: { paymentInfoList, pagination },
      })
    );
  } catch (error) {
    console.error(error);
    logger.error(error.message, req.originalUrl);
    return res.status(500).json(
      response({
        status: "Error",
        statusCode: "500",
        type: "Payment Info History",
        message: req.t("server-error"),
      })
    );
  }
};

module.exports = { getPaymentInfoHistory };
