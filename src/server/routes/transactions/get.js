const Transaction = require("../../models/Transaction");

module.exports = async (req, res) => {
  const transactions = await Transaction.find();

  res.json(transactions);
};
