const Category = require("../../models/Category");
const Transaction = require("../../models/Transaction");

module.exports = async (req, res) => {
  const categories = await Category.find().lean();

  if (req.params.start && req.params.end) {
    for (const [index, category] of categories.entries()) {
      const transactions = await Transaction.find({
        categoryId: category._id,
        date: {
          $gte: new Date(req.params.start),
          $lte: new Date(req.params.end),
        },
      })
        .sort({ date: -1 })
        .lean();

      categories[index].transactions = transactions;
      categories[index].income = transactions.reduce(
        (prevValue, currValue) =>
          currValue.amount > 0 ? prevValue + currValue.amount : prevValue,
        0
      );
      categories[index].outcome = transactions.reduce(
        (prevValue, currValue) =>
          currValue.amount < 0 ? prevValue + currValue.amount : prevValue,
        0
      );
    }
  }

  res.json(categories);
};
