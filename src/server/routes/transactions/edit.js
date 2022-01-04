const Transaction = require("../../models/Transaction");

module.exports = async (req, res) => {
  await Transaction.findByIdAndUpdate(req.params.id, {
    name: req.body.name,
    amount: req.body.amount,
    categoryId: req.body.categoryId,
    date: req.body.date,
  });

  res.json(req.body);
};
