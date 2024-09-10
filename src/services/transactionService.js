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
      count: 0,
    }));

    allTransactions.forEach((transaction) => {
      const createdAt = new Date(transaction.createdAt);
      const monthIndex = createdAt.getMonth();
      const monthCount = monthlyCounts[monthIndex];
      monthCount.amount += transaction.amountToSent;
      monthCount.count += 1;
    });

    return monthlyCounts;
  } catch (error) {
    throw error;
  }
};

const transactionWeeklyChart = async () => {
  try {
    const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fr", "Sat"];

    // Get current day index
    const currentDayIndex = new Date().getDay(); // 0 for Sunday, 1 for Monday, etc.

    // Create a new array with the current day first, followed by the previous 6 days
    const last7DaysData = Array.from({ length: 7 }, (_, i) => {
      const dayIndex = (currentDayIndex - i + 7) % 7;
      return {
        name: daysOfWeek[dayIndex],
        amount: 0,
        count: 0,
      };
    });

    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const transactionData = await Transaction.find({
      createdAt: {
        $gte: sevenDaysAgo,
      },
    });

    transactionData.forEach((transaction) => {
      const transactionDate = new Date(transaction.createdAt);
      const dayOfWeek = transactionDate.getDay();

      last7DaysData[dayOfWeek].amount += transaction.amountToSent;
      last7DaysData[dayOfWeek].count += 1;
    });

    // console.log(last7DaysData);

    // console.log("......start...............");
    // console.log(transactionData);
    // console.log("......end...............");

    return last7DaysData.reverse();
  } catch (error) {
    throw error;
  }
};
const transactionHourChart = async () => {
  try {
    const currentHour = new Date().getHours(); // Get the current hour dynamically
    const totalHours = 24;

    // Create an array starting from the current hour, decrementing to 1
    const firstPart = Array.from({ length: currentHour }, (_, i) => ({
      name: currentHour - i,
      amount: 0,
      count: 0, // Replace this with the actual amount logic
    }));

    // Create an array starting from 24, decrementing to the hour after the current hour
    const secondPart = Array.from(
      { length: totalHours - currentHour },
      (_, i) => ({
        name: totalHours - i,
        amount: 0,
        count: 0, // Replace this with the actual amount logic
      })
    );

    const last24HoursData = [...firstPart, ...secondPart];

    const twentyFourHoursAgo = new Date();
    twentyFourHoursAgo.setHours(twentyFourHoursAgo.getHours() - 24);

    // Fetch transactions from the last 24 hours
    const transactionData = await Transaction.find({
      createdAt: {
        $gte: twentyFourHoursAgo,
      },
    });

    // Iterate through each transaction to update the hoursOfDay array
    transactionData.forEach((transaction) => {
      const transactionDate = new Date(transaction.createdAt);
      const hourOfDay = transactionDate.getHours(); // Get the hour (0 to 23)

      // Add the amountToSent to the corresponding hour in hoursOfDay
      last24HoursData[hourOfDay].amount += transaction.amountToSent;
      last24HoursData[hourOfDay].count += 1;
    });

    // console.log(last24HoursData);

    return last24HoursData.reverse();
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
