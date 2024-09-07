const generateCustomID = require("../helpers/generateCustomId");
const Transaction = require("../models/Transaction");
const User = require("../models/User");

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
};

const transactionDetailsById = async (id) => {
  try {
    return await Transaction.findById(id)
      .select("-hiddenFees")
      .populate("sender", "fullName image")
      .populate("country", "countryFlag");
  } catch (error) {
    throw error;
  }
};

const transactionDetailsByIdAndSender = async (id, senderId) => {
  try {
    const transaction = await Transaction.findOne({ _id: id, sender: senderId })
      .select("-hiddenFees")
      .populate("sender", "fullName image")
      .populate("country", "countryFlag");
    if (!transaction) {
      throw null;
    }
    return transaction;
  } catch (error) {
    throw error;
  }
};

const allTransactions = async (filter, options) => {
  try {
    const { page = 1, limit = 10 } = options;
    const skip = (page - 1) * limit;
    const transactionList = await Transaction.find({ ...filter })
      .select("-hiddenFees")
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 })
      .populate("country", "countryFlag name")
      .populate("sender", "fullName image email phoneNumber");
    const totalResults = await Transaction.countDocuments({ ...filter });
    const totalPages = Math.ceil(totalResults / limit);
    const pagination = { totalResults, totalPages, currentPage: page, limit };
    return { transactionList, pagination };
  } catch (error) {
    throw error;
  }
};

const transactionsAllHistory = async (filter) => {
  try {
    const transactionList = await Transaction.find({ ...filter })
      .select("-hiddenFees")
      .sort({ createdAt: -1 })
      .populate("country", "countryFlag name")
      .populate("sender", "fullName image email phoneNumber");
    return { transactionList, pagination: {} };
  } catch (error) {
    throw error;
  }
};

const updateTransactionById = async (transactionId, transactionbody) => {
  try {
    return await Transaction.findByIdAndUpdate(transactionId, transactionbody, {
      new: true,
    });
  } catch (error) {
    throw error;
  }
};

const transactionCounts = async () => {
  try {
    const totalTransactions = await Transaction.countDocuments({
      userConfirmation: true,
    });
    const cancelledTransactions = await Transaction.countDocuments({
      status: "cancelled",
      userConfirmation: true,
    });
    const pendingTransactions = await Transaction.countDocuments({
      status: "pending",
      userConfirmation: true,
    });
    const transferredTransactions = await Transaction.countDocuments({
      status: "transferred",
      userConfirmation: true,
    });
    const userCounts = await User.countDocuments({ role: "user" });

    return {
      totalTransactions,
      cancelledTransactions,
      transferredTransactions,
      pendingTransactions,
      userCounts,
    };
  } catch (error) {
    throw error;
  }
};

const transactionChart = async (year) => {
  try {
    const yearStartDate = new Date(year, 0, 1);
    const yearEndDate = new Date(year + 1, 0, 1);
    const allTransactions = await Transaction.find({
      createdAt: { $gte: yearStartDate, $lt: yearEndDate },
      status: { $in: ["accepted", "transferred"] },
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
  } catch (error) {
    throw error;
  }
};

const transactionWeeklyChart = async () => {
  try {
    const daysOfWeek = ["Sun", "Mon", "Tues", "Wed", "Thur", "Fri", "Sat"];
    const last7DaysData = [];

    for (let i = 0; i < 7; i++) {
      // Calculate the start and end of the day
      const dayStart = new Date();
      dayStart.setHours(0, 0, 0, 0);
      dayStart.setDate(dayStart.getDate() - i);

      const dayEnd = new Date(dayStart);
      dayEnd.setDate(dayEnd.getDate() + 1);

      // Query to count the transactions for the day
      const transactionCount = await Transaction.countDocuments({
        createdAt: { $gte: dayStart, $lt: dayEnd },
        status: { $in: ["accepted", "transferred"] },
      });

      // Add the result to the array
      last7DaysData.push({
        name: daysOfWeek[dayStart.getDay()],
        amount: transactionCount,
      });
    }

    // Reverse the array to show the data in chronological order (Sunday to Saturday)
    last7DaysData.reverse();
    return last7DaysData;
  } catch (error) {
    throw error;
  }
};
const transactionHourChart = async () => {
  try {
    const hoursOfDay = Array.from({ length: 24 }, (_, i) => i + 1);
    const last12HoursData = [];

    for (let i = 0; i < 24; i++) {
      // Calculate the start and end of the hour
      const hourStart = new Date();
      hourStart.setMinutes(0, 0, 0);
      hourStart.setHours(hourStart.getHours() - i);

      const hourEnd = new Date(hourStart);
      hourEnd.setHours(hourEnd.getHours() + 1);

      // Query to count the transactions for the hour
      const transactionCount = await Transaction.countDocuments({
        createdAt: { $gte: hourStart, $lt: hourEnd },
        status: { $in: ["accepted", "transferred"] },
      });

      // Add the result to the array
      last12HoursData.push({
        name: hourStart.getHours(),
        amount: transactionCount,
      });
    }

    // Reverse the array to show the data in chronological order (oldest to newest)
    last12HoursData.reverse();

    return last12HoursData;
  } catch (error) {
    throw error;
  }
};

module.exports = {
  addTransaction,
  transactionDetailsById,
  updateTransactionById,
  allTransactions,
  transactionCounts,
  transactionChart,
  transactionWeeklyChart,
  transactionHourChart,
  transactionsAllHistory,
  transactionDetailsByIdAndSender,
};
