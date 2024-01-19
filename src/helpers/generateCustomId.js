// customIDGenerator.js
const Transaction = require('../models/Transaction')
async function generateCustomID() {
  try {
    const date = new Date();
    const year = date.getFullYear().toString().slice(-2);
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    let randomDigits = '';

    const number = await Transaction.findOne().select('transactionId').sort({ createdAt: -1 });
    if (number && number.transactionId) {
      const lastNumber = parseInt(number.transactionId.split('-')[1]);
      const newNumber = (lastNumber + 1).toString().padStart(3, '0');
      randomDigits = newNumber;
    } else {
      randomDigits = '001';
    }
    const customID = `#${year+month+day}-${randomDigits}`;
    console.log('Custom ID: ',customID);
    return customID;
  }
  catch (err) {
    console.log(err)
  }
}

module.exports = generateCustomID;
