const express = require("express");
const cors = require("cors");
const userRouter = require("./routes/userRouter");
const transactionRouter = require("./routes/transactionRouter");
const personalDataPolicyRouter = require("./routes/personalDataPolicyRouter");
const refundAndCancellationPolicyRouter = require("./routes/refundAndCancellationPolicyRouter");
const termsOfMoneyTransferRouter = require("./routes/termsOfMoneyTransferRouter");
const termsOfServiceRouter = require("./routes/termsOfServiceRouter");
const notificationRouter = require("./routes/notificationRouter");
const hiidenFeeRouter = require("./routes/hiddenFeeRouter");
const paymentInfoRouter = require("./routes/paymentInfoRouter");
const countryRouter = require("./routes/countryRouter");

const { notFoundHandler, errorHandler } = require("./middlewares/errorHandler");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
require("dotenv").config();
const app = express();

const mongoURI = process.env.MONGODB_CONNECTION; // Replace with your actual environment variable name

mongoose
  .connect(mongoURI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((error) => console.error("Error connecting to MongoDB:", error));

//making public folder static for publicly access
app.use(express.static("public"));

// For handling form data
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Enable CORS
app.use(
  cors({
    origin: "*",
    //[
    //   process.env.ALLOWED_CLIENT_URL_DASHBOARD,
    //   process.env.ALLOWED_CLIENT_URL_WEB,
    //   process.env.ALLOWED_CLIENT_URL_SUB_DASHBOARD
    // ],
    optionsSuccessStatus: 200,
  })
);

//configuring i18next
const i18next = require("i18next");
const i18nextMiddleware = require("i18next-http-middleware");
const Backend = require("i18next-node-fs-backend");

i18next
  .use(Backend)
  .use(i18nextMiddleware.LanguageDetector)
  .init({
    backend: {
      loadPath: __dirname + "/translation/{{lng}}/translation.json",
    },
    detection: {
      order: ["header"],
      caches: ["cookie"],
    },
    preload: ["en", "fr"],
    fallbackLng: process.env.API_RESPONCE_LANGUAGE,
  });
app.use(i18nextMiddleware.handle(i18next));

//initilizing API routes
app.use("/api/users", userRouter);
app.use("/api/transactions", transactionRouter);
app.use("/api/personal-data-policies", personalDataPolicyRouter);
app.use(
  "/api/refund-and-cancellation-policies",
  refundAndCancellationPolicyRouter
);
app.use("/api/terms-of-money-transfers", termsOfMoneyTransferRouter);
app.use("/api/terms-of-services", termsOfServiceRouter);
app.use("/api/notifications", notificationRouter);
app.use("/api/hidden-fees", hiidenFeeRouter);
app.use("/api/payment-info", paymentInfoRouter);
app.use("/api/countries", countryRouter);

//testing API is alive
app.get("/test", (req, res) => {
  res.send(req.t("Back-end is responding!!"));
});

//invalid route handler
app.use(notFoundHandler);
//error handling
app.use(errorHandler);
module.exports = app;
