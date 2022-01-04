const express = require("express");
const app = express();
const mongoose = require("mongoose");

// Middlewares
app.use(express.static("dist/debabki"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Categories
app.get("/categories/:start?/:end?", require("./routes/categories/get"));
app.post("/categories", require("./routes/categories/add"));
app.put("/categories/:id", require("./routes/categories/edit"));
app.delete("/categories/:id", require("./routes/categories/delete"));

// Summary
app.get("/summary/:start/:end", require("./routes/summary/get"));

// Transactions
app.get("/transactions", require("./routes/transactions/get"));
app.post("/transactions", require("./routes/transactions/add"));
app.put("/transactions/:id", require("./routes/transactions/edit"));
app.delete("/transactions/:id", require("./routes/transactions/delete"));

// Start server
app.listen(5000, () =>
  console.log("Server is listening on http://localhost:5000")
);

// Start db
mongoose.connect("mongodb://localhost/debabki", () =>
  console.log("MongoDB connected")
);
