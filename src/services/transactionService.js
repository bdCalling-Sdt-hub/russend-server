const generateCustomID = require('../helpers/generateCustomId');
const Transaction = require('../models/Transaction');

const addTransaction = async (transactionBody, sender) => {
  try {
    const transaction = new Transaction(transactionBody);
    transaction.transactionId = await generateCustomID();
    transaction.sender = sender;
    await transaction.save();
    return transaction;
  } catch (error) {
    throw error;
  }
}

const transactionDetailsById = async (id) => {
  try {
    return await Transaction.findById(id).select("-hiddenFees").populate('sender', 'fullName image').populate('country', 'countryFlag');

  }
  catch (error) {
    throw error;
  }
}

const allTransactions = async (filter, options) => {
  try {
    const { page = 1, limit = 10 } = options;
    const skip = (page - 1) * limit;
    const transactionList = await Transaction.find({ ...filter }).select("-hiddenFees").skip(skip).limit(limit).sort({ createdAt: -1 }).populate('country', 'countryFlag name').populate('sender', 'fullName image email phoneNumber');
    const totalResults = await Transaction.countDocuments({ ...filter });
    const totalPages = Math.ceil(totalResults / limit);
    const pagination = { totalResults, totalPages, currentPage: page, limit };
    return { transactionList, pagination };
  }
  catch (error) {
    throw error;
  }
}

const updateTransactionById = async (transactionId, transactionbody) => {
  try {
    return await Transaction.findByIdAndUpdate(transactionId, transactionbody, { new: true });
  }
  catch (error) {
    throw error;
  }
}

const transactionCounts = async () => {
  try {
    const totalTransactions = await Transaction.countDocuments();
    const approvedTransactions = await Transaction.countDocuments({ status: 'accepted' });
    const pendingTransactions = await Transaction.countDocuments({ status: 'pending' });
    const transferredTransactions = await Transaction.countDocuments({ status: 'transferred' });
    return { totalTransactions, approvedTransactions, transferredTransactions, pendingTransactions };
  }
  catch (error) {
    throw error;
  }
}

const transactionChart = async (year) => {
  try {
    const yearStartDate = new Date(year, 0, 1);
    const yearEndDate = new Date(year + 1, 0, 1);
    const allTransactions = await Transaction.find({
      createdAt: { $gte: yearStartDate, $lt: yearEndDate },
      status: {$in:["accepted", "transferred"]}
    });

    const monthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    const monthlyCounts = monthNames.map((month, index) => ({
      name: month,
      amount: 0,
    }));

    allTransactions.forEach((transaction) => {
      const createdAt = new Date(transaction.createdAt);
      const monthIndex = createdAt.getMonth();
      const monthCount = monthlyCounts[monthIndex];
      monthCount.amount += transaction.amountToSent;
    });

    return monthlyCounts;

  }
  catch (error) {
    throw error;
  }
}

module.exports = {
  addTransaction,
  transactionDetailsById,
  updateTransactionById,
  allTransactions,
  transactionCounts,
  transactionChart
}
