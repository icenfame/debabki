const Transaction = require("../../models/Transaction");

module.exports = async (req, res) => {
  await Transaction.findByIdAndDelete(req.params.id);

  res.json(req.params);
};
