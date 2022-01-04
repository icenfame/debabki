const express = require("express");
const app = express();
const mongoose = require("mongoose");
const moment = require("moment");

// Data base connection
mongoose.connect("mongodb://localhost/debabki").then(() => {
  console.log("MongoDB connected");
});

// Category schema
const categorySchema = new mongoose.Schema({
  name: String,
  description: String,
});
const Category = mongoose.model("Category", categorySchema);

// Transaction schema
const transactionSchema = new mongoose.Schema({
  name: String,
  amount: Number,
  categoryId: mongoose.SchemaTypes.ObjectId,
  date: Date,
});
const Transaction = mongoose.model("Transaction", transactionSchema);

// Middlewares
app.use(express.static("dist/debabki"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Categories
app.get("/categories/:start/:end", async (req, res) => {
  const categories = await Category.find().lean();

  for (const [index, category] of categories.entries()) {
    const transactions = await Transaction.find({
      categoryId: category._id,
      date: {
        $gte: moment(moment.unix(req.params.start)).toDate(),
        $lte: moment(moment.unix(req.params.end)).toDate(),
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

  res.json(categories);
});
app.post("/categories", async (req, res) => {
  const document = await Category.create({
    name: req.body.name,
    description: req.body.description,
  });

  res.json(document);
});
app.put("/categories/:id", async (req, res) => {
  await Category.findByIdAndUpdate(req.params.id, {
    name: req.body.name,
    description: req.body.description,
  });

  res.json(req.body);
});
app.delete("/categories/:id", async (req, res) => {
  await Category.findByIdAndDelete(req.params.id);
  await Transaction.deleteMany({
    categoryId: req.params.id,
  });

  res.json(req.params);
});

// Summary
app.get("/summary/:start/:end", async (req, res) => {
  const summary = await Transaction.aggregate([
    {
      $group: {
        _id: null,
        income: {
          $sum: {
            $cond: [
              {
                $and: [
                  {
                    $gt: ["$amount", 0],
                  },
                  {
                    $gte: [
                      "$date",
                      moment(moment.unix(req.params.start)).toDate(),
                    ],
                  },
                  {
                    $lte: [
                      "$date",
                      moment(moment.unix(req.params.end)).toDate(),
                    ],
                  },
                ],
              },
              "$amount",
              0,
            ],
          },
        },
        outcome: {
          $sum: {
            $cond: [
              {
                $and: [
                  {
                    $lt: ["$amount", 0],
                  },
                  {
                    $gte: [
                      "$date",
                      moment(moment.unix(req.params.start)).toDate(),
                    ],
                  },
                  {
                    $lte: [
                      "$date",
                      moment(moment.unix(req.params.end)).toDate(),
                    ],
                  },
                ],
              },
              "$amount",
              0,
            ],
          },
        },
      },
    },
  ]);

  res.json(summary[0]);
});

// Transactions
app.get("/transactions", async (req, res) => {
  const transactions = await Transaction.find();
  res.json(transactions);
});
app.post("/transactions", async (req, res) => {
  const document = await Transaction.create({
    name: req.body.name,
    amount: req.body.amount,
    categoryId: req.body.categoryId,
    date: req.body.date,
  });

  res.json(document);
});
app.put("/transactions/:id", async (req, res) => {
  await Transaction.findByIdAndUpdate(req.params.id, {
    name: req.body.name,
    amount: req.body.amount,
    categoryId: req.body.categoryId,
    date: req.body.date,
  });

  res.json(req.body);
});
app.delete("/transactions/:id", async (req, res) => {
  await Transaction.findByIdAndDelete(req.params.id);
  res.json(req.params);
});

// Start server
app.listen(5000, () =>
  console.log("Server is listening on http://localhost:5000")
);
