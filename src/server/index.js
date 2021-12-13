const express = require("express");
const app = express();
const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost/debabki").then(() => {
  console.log("MongoDB connected");
});

const categorySchema = new mongoose.Schema({
  name: String,
  description: String,
});
const Category = mongoose.model("Category", categorySchema, "categories");

app.use(express.static("dist/debabki"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.get("/categories", async (req, res) => {
  const categories = await Category.find();
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
  res.json(req.params);
});

app.listen(5000, () =>
  console.log("Server is listening on http://localhost:5000")
);
