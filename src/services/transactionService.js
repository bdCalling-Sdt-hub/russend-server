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

    // console.log(allTransactions);

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

    const currentDayIndex = new Date().getDay();

    const last7DaysData = Array.from({ length: 7 }, (_, i) => {
      const dayIndex = (currentDayIndex - i + 7) % 7;
      return {
        name: daysOfWeek[i],
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
      status: { $in: ["accepted", "transferred"] },
    });

    transactionData.forEach((transaction) => {
      const transactionDate = new Date(transaction.createdAt);
      const dayOfWeek = transactionDate.getDay();

      last7DaysData[dayOfWeek].amount += transaction.amountToSent;
      last7DaysData[dayOfWeek].count += 1;
    });

    let last7DaysDataSorting = [];

    last7DaysData.forEach((day, i) => {
      const dayIndex = (currentDayIndex - i + 7) % 7;

      last7DaysDataSorting.push(last7DaysData[dayIndex]);
    });

    return last7DaysDataSorting.reverse();
  } catch (error) {
    throw error;
  }
};
const transactionHourChart = async () => {
  try {
    const currentHour = new Date().getHours();

    const last24HoursData = Array.from({ length: 24 }, (_, i) => ({
      name: i,
      amount: 0,
      count: 0,
    }));

    // console.log(last24HoursData);

    const twentyFourHoursAgo = new Date();
    twentyFourHoursAgo.setHours(twentyFourHoursAgo.getHours() - 24);

    // Fetch transactions from the last 24 hours
    const transactionData = await Transaction.find({
      createdAt: {
        $gte: twentyFourHoursAgo,
      },
      status: { $in: ["accepted", "transferred"] },
    });

    // Iterate through each transaction to update the hoursOfDay array
    transactionData.forEach((transaction) => {
      const transactionDate = new Date(transaction.createdAt);
      const hourOfDay = transactionDate.getHours(); // Get the hour (0 to 23)
      // console.log(transaction);
      // console.log(hourOfDay);
      last24HoursData[hourOfDay].amount += transaction.amountToSent;
      last24HoursData[hourOfDay].count += 1;
    });

    let last24HoursDataSorting = [];

    last24HoursData.forEach((hour, i) => {
      const hourIndex = (currentHour - i + 24) % 24;

      // console.log(hourIndex);

      last24HoursDataSorting.push(last24HoursData[hourIndex]);

      // last7DaysDataSorting.push(last24HoursData[dayIndex]);
    });

    // console.log(transactionData);
    return last24HoursDataSorting.reverse();
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
