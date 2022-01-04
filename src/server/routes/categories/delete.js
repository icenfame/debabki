const Category = require("../../models/Category");
const Transaction = require("../../models/Transaction");

module.exports = async (req, res) => {
  await Category.findByIdAndDelete(req.params.id);
  await Transaction.deleteMany({
    categoryId: req.params.id,
  });

  res.json(req.params);
};
