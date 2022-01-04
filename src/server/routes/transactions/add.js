const Transaction = require("../../models/Transaction");

module.exports = async (req, res) => {
  const document = await Transaction.create({
    name: req.body.name,
    amount: req.body.amount,
    categoryId: req.body.categoryId,
    date: req.body.date,
  });

  res.json(document);
};
