const Category = require("../../models/Category");

module.exports = async (req, res) => {
  const document = await Category.create({
    name: req.body.name,
    description: req.body.description,
  });

  res.json(document);
};
