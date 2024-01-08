const Transaction = require('../models/Transaction');

const addTransaction = async (transactionBody) => {
  try {
    const transaction = new Transaction(transactionBody);
    await transaction.save();
    return transaction;
  } catch (error) {
    throw error;
  }
}

const getTransactionById = async (id) => {
  try {
    return await Transaction.findById(id);
  }
  catch (error) {
    throw error;
  }
}

const getAllTransactions = async (filter, options) => {
  try {
    const { page = 1, limit = 10 } = options;
    const skip = (page - 1) * limit;
    const transactionList = await Transaction.find({ ...filter }).skip(skip).limit(limit).sort({ createdAt: -1 });
    const totalResults = await Transaction.countDocuments({ ...filter });
    const totalPages = Math.ceil(totalResults / limit);
    const pagination = { totalResults, totalPages, currentPage: page, limit };
    return { transactionList, pagination };
  }
  catch (error) {
    throw error;
  }
}

const updateTransaction = async (transactionId, transactionbody) => {
  try {
    const existingTransaction = await Transaction.findById(transactionId);
    if (!existingTransaction) {
      throw new Error('Transaction not found');
    }
    const transaction = new Transaction(transactionbody);
    Object.assign(existingTransaction, transaction);
    await existingTransaction.save();
    return existingTransaction;
  }
  catch (error) {
    throw error;
  }
}

module.exports = {
  addTransaction,
  getTransactionById,
  updateTransaction,
  getAllTransactions
}
