const { addTransaction, allTransactions, transactionDetailsById, transactionCounts, transactionChart, updateTransactionById, transactionDetailsByIdAndSender } = require('../services/transactionService')
const response = require('../helpers/response')
const logger = require('../helpers/logger');
const { addNotification } = require('../services/notificationService');
const { getUserById } = require('../services/userService');

const addTransactionController = async (req, res) => {
  try {
    const user = await getUserById(req.body.userId);
    if (!user || (user && user.role !== 'user')) {
      return res.status(400).json(response({ status: 'Error', statusCode: '400', type: 'Transaction', message: req.t('unauthorised') }));
      return; // Add return statement to stop further execution
    }

    // Assuming `userConfirmation` is initially false
    const transaction = await addTransaction(req.body, req.body.userId);

    // Set a timeout for 10 minutes to update userConfirmation
    setTimeout(async () => {
      const updatedTransaction = await transactionDetailsById(transaction._id)
      if (!updatedTransaction?.userConfirmation) {
        await updateTransactionById(transaction._id, { userConfirmation: true })
      }
    }, 10 * 60 * 1000); // 10 minutes in milliseconds

    return res.status(201).json(response({ status: 'Success', statusCode: '201', type: 'Transaction', message: req.t('transaction-added'), data: transaction }));
  } catch (error) {
    console.error(error);
    logger.error(error.message, req.originalUrl);
    return res.status(500).json(response({ status: 'Error', statusCode: '500', type: 'Transaction', message: req.t('server-error') }));
  }
}


const getAllTransactions = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;

    const options = {
      page, limit
    }

    const filter = {};
    if (req.body.userRole === 'user') {
      filter.sender = req.body.userId;
    }
    else {
      filter.status = { $eq: 'pending' }
    }
    const { transactionList, pagination } = await allTransactions(filter, options);
    return res.status(200).json(response({ status: 'Success', statusCode: '200', type: 'Transaction', message: req.t('transaction-list'), data: { transactionList, pagination } }));
  } catch (error) {
    console.error(error);
    logger.error(error.message, req.originalUrl);
    return res.status(500).json(response({ status: 'Error', statusCode: '500', type: 'Transaction', message: req.t('server-error') }));
  }
}

// const getAcceptedTransactionList = async (req, res) => {
//   try {
//     if(req.body.userRole === 'user') {
//       res.status(400).json(response({ status: 'Error', statusCode: '400', type: 'Transaction', message: req.t('unauthorised') }));
//     }
//     const page = Number(req.query.page) || 1;
//     const limit = Number(req.query.limit) || 10;

//     const options = {
//       page, limit
//     }

//     const filter = {
//       status : { $eq: 'accepted' }
//     };

//     const { transactionList, pagination } = await allTransactions(filter, options);
//     return res.status(200).json(response({ status: 'Success', statusCode: '200', type: 'Transaction', message: req.t('transaction-list'), data: { transactionList, pagination } }));
//   } catch (error) {
//     console.error(error);
//     logger.error(error.message, req.originalUrl);
//     return res.status(500).json(response({ status: 'Error', statusCode: '500', type: 'Transaction', message: req.t('server-error') }));
//   }
// }

const getTransactionById = async (req, res) => {
  try {
    const transaction = await transactionDetailsById(req.params.id);
    return res.status(201).json(response({ status: 'Success', statusCode: '201', message: req.t('transactionAdded'), data: transaction }));
  } catch (error) {
    console.error(error);
    logger.error(error.message, req.originalUrl);
    return res.status(500).json(response({ status: 'Error', statusCode: '500', type: 'Transaction', message: req.t('server-error') }));
  }
}

// const acceptTransaction = async (req, res) => {
//   try {
//     if (req.body.userRole === 'user') {
//       res.status(400).json(response({ status: 'Error', statusCode: '400', type: 'Transaction', message: req.t('unauthorised') }));
//     }
//     const transaction = await transactionDetailsById(req.params.id);
//     if (!transaction.status) {
//       return res.status(400).json(response({ status: 'Error', statusCode: '400', type: 'Transaction', message: req.t('transaction-not-found') }));
//     }
//     const updatedTransaction = await updateTransactionById(req.params.id, { status: 'accepted' });
//     var message = 'Your transfer of ' + transaction.amountToSent + transaction.ammountToSentCurrency+ ' to ' + transaction.lastName + ' has been accepted';
//     const notification = {
//       message: message,
//       receiver: transaction.sender,
//       linkId: updatedTransaction._id,
//       type: 'Transaction',
//       role: ['user'],
//     }
//     const sendNotification = await addNotification(notification);
//     const roomId = 'user-notification::' + transaction.sender._id.toString();
//     io.emit(roomId, sendNotification)
//     return res.status(200).json(response({ status: 'Success', statusCode: '201', type: 'Transaction', message: req.t('transaction-accepted'), data: updatedTransaction }));
//   } catch (error) {
//     console.error(error);
//     logger.error(error.message, req.originalUrl);
//     return res.status(500).json(response({ status: 'Error', statusCode: '500', type: 'Transaction', message: req.t('server-error') }));
//   }
// }

const cancelTransaction = async (req, res) => {
  try {
    if (req.body.userRole === 'user') {
      return res.status(400).json(response({ status: 'Error', statusCode: '400', type: 'Transaction', message: req.t('unauthorised') }));
    }
    const transaction = await transactionDetailsById(req.params.id);
    if (!transaction.status) {
      return res.status(400).json(response({ status: 'Error', statusCode: '400', type: 'Transaction', message: req.t('transaction-not-found') }));
    }
    const updatedTransaction = await updateTransactionById(req.params.id, { status: 'cancelled' });

    var message = 'Your transfer of ' + transaction.amountToSent + transaction.ammountToSentCurrency + ' to ' + transaction.lastName + ' was cancelled';
    const notification = {
      message: message,
      receiver: transaction.sender,
      linkId: updatedTransaction._id,
      type: 'Transaction',
      role: ['user'],
    }
    const sendNotification = await addNotification(notification);
    const roomId = 'user-notification::' + transaction.sender._id.toString();
    io.emit(roomId, sendNotification)

    return res.status(200).json(response({ status: 'Success', statusCode: '201', type: 'Transaction', message: req.t('transaction-cancelled'), data: updatedTransaction }));
  } catch (error) {
    console.error(error);
    logger.error(error.message, req.originalUrl);
    return res.status(500).json(response({ status: 'Error', statusCode: '500', type: 'Transaction', message: req.t('server-error') }));
  }
}

const updateTransactionToSent = async (req, res) => {
  try {
    if (req.body.userRole === 'user') {
      return res.status(400).json(response({ status: 'Error', statusCode: '400', type: 'Transaction', message: req.t('unauthorised') }));
    }
    const transaction = await transactionDetailsById(req.params.id);
    if (!transaction.status) {
      return res.status(400).json(response({ status: 'Error', statusCode: '400', type: 'Transaction', message: req.t('transaction-not-found') }));
    }
    const updatedTransaction = await updateTransactionById(req.params.id, { status: 'transferred' });

    var message = transaction.lastName + ' has received your transfer of ' + transaction.amountToSent + transaction.ammountToSentCurrency
    const notification = {
      message: message,
      receiver: transaction.sender,
      linkId: updatedTransaction._id,
      type: 'Transaction',
      role: ['user'],
    }
    const sendNotification = await addNotification(notification);
    const roomId = 'user-notification::' + transaction.sender._id.toString();
    io.emit(roomId, sendNotification)

    return res.status(200).json(response({ status: 'Success', statusCode: '201', type: 'Transaction', message: req.t('transaction-cancelled'), data: updatedTransaction }));
  } catch (error) {
    console.error(error);
    logger.error(error.message, req.originalUrl);
    return res.status(500).json(response({ status: 'Error', statusCode: '500', type: 'Transaction', message: req.t('server-error') }));
  }
}

const getTransactionCounts = async (req, res) => {
  try {
    const { totalTransactions, cancelledTransactions, pendingTransactions, transferredTransactions, userCounts } = await transactionCounts();
    return res.status(201).json(response({ status: 'Success', statusCode: '201', type: 'Transaction', message: req.t('transaction-counts'), data: { totalTransactions, cancelledTransactions, transferredTransactions, pendingTransactions, userCounts } }));
  } catch (error) {
    console.error(error);
    logger.error(error.message, req.originalUrl);
    return res.status(500).json(response({ status: 'Error', statusCode: '500', type: 'Transaction', message: req.t('server-error') }));
  }
}

const confirmTransactionByUser = async (req, res) => {
  try {
    if (req.body.userRole !== 'user') {
      return res.status(400).json(response({ status: 'Error', statusCode: '400', type: 'Transaction', message: req.t('unauthorised') }));
    }
    const transaction = await transactionDetailsByIdAndSender(req.params.id, req.body.userId);
    if (transaction === null) {
      return res.status(400).json(response({ status: 'Error', statusCode: '400', type: 'Transaction', message: req.t('transaction-not-found') }));
    } else if (transaction.userConfirmation) { // Add an else if condition here
      return res.status(400).json(response({ status: 'Error', statusCode: '400', type: 'Transaction', message: req.t('transaction-already-confirmed') }));
    }
    const updatedTransaction = await updateTransactionById(req.params.id, { userConfirmation: true, status: "pending" });
    var message = transaction?.sender?.fullName + ' wants to send ' + transaction?.amountToSent + ' RUB to ' + transaction?.lastName;
    const notification = {
      message: message,
      linkId: transaction._id,
      type: 'Transaction',
      role: ['admin', 'worker'],
    }
    const sendNotification = await addNotification(notification);
    io.emit('russend-admin-notification', { status: 1008, message: sendNotification.message })
    return res.status(200).json(response({ status: 'Success', statusCode: '200', type: 'Transaction', message: req.t('transaction-confirmed'), data: updatedTransaction }));
  }
  catch (error) {
    console.error(error);
    logger.error(error, req.originalUrl);
    return res.status(500).json(response({ status: 'Error', statusCode: '500', type: 'Transaction', message: req.t('server-error') }));
  }
}

const getTransactionChart = async (req, res) => {
  try {
    const year = Number(req.query.year) || new Date().getFullYear();
    const data = await transactionChart(year);
    return res.status(201).json(response({ status: 'Success', statusCode: '201', type: 'Transaction', message: req.t('transaction-chart'), data: data }));
  } catch (error) {
    console.error(error);
    logger.error(error.message, req.originalUrl);
    return res.status(500).json(response({ status: 'Error', statusCode: '500', type: 'Transaction', message: req.t('server-error') }));
  }
}

const getTransactionHistory = async (req, res) => {
  try {
    if (req.body.userRole === 'user') {
      return res.status(400).json(response({ status: 'Error', statusCode: '400', type: 'Transaction', message: req.t('unauthorised') }));
    }
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;

    const options = {
      page, limit
    }

    var filter = {
      status: { $ne: 'pending' },
    };

    const search = req.query.search;
    const searchRegExp = new RegExp('.*' + search + '.*', 'i');

    if (search) {
      filter.$or = [
        { firstName: searchRegExp },
        { lastName: searchRegExp },
        { transactionId: searchRegExp },
        { email: searchRegExp },
        { phoneNumber: searchRegExp },
      ]
    }

    const { transactionList, pagination } = await allTransactions(filter, options);
    return res.status(200).json(response({ status: 'Success', statusCode: '200', type: 'Transaction', message: req.t('transaction-list'), data: { transactionList, pagination } }));
  } catch (error) {
    console.error(error);
    logger.error(error.message, req.originalUrl);
    return res.status(500).json(response({ status: 'Error', statusCode: '500', type: 'Transaction', message: req.t('server-error') }));
  }
}

module.exports = { addTransactionController, getAllTransactions, getTransactionById, updateTransactionToSent, cancelTransaction, getTransactionCounts, getTransactionChart, getTransactionHistory, confirmTransactionByUser }