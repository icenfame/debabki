const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema({
  name: String,
  amount: Number,
  categoryId: mongoose.SchemaTypes.ObjectId,
  date: Date,
});

module.exports = mongoose.model("Transaction", transactionSchema);
