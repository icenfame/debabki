const Category = require("../../models/Category");

module.exports = async (req, res) => {
  await Category.findByIdAndUpdate(req.params.id, {
    name: req.body.name,
    description: req.body.description,
  });

  res.json(req.body);
};
