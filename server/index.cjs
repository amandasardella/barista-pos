const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// ✅ Conexão com MongoDB
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) =>
    console.error("❌ Error connecting to MongoDB:", err.message)
  );

// ✅ Schema e Model
const OrderSchema = new mongoose.Schema({
  drink: { type: String, required: true },
  milk: { type: String, default: null },
  syrup: { type: String, default: null },
  decaf: { type: Boolean, default: false },
  extraShot: { type: Boolean, default: false },
  date: { type: Date, default: Date.now },
});

const Order = mongoose.model("Order", OrderSchema);

// ✅ Rotas
app.get("/", (req, res) => {
  res.send("☕ Barista PoS backend is running!");
});

app.get("/orders", async (req, res) => {
  const orders = await Order.find();
  res.json(orders);
});

app.post("/orders", async (req, res) => {
  try {
    const order = new Order(req.body);
    const saved = await order.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.delete("/orders/:id", async (req, res) => {
  const order = await Order.findByIdAndDelete(req.params.id);
  res.json(order);
});

app.put("/orders/:id", async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!order) return res.status(404).json({ error: "Order not found" });
    res.json(order);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.get("/orders/by-date", async (req, res) => {
  const { date } = req.query;
  if (!date) return res.status(400).json({ error: "Date not provided" });

  const start = new Date(date);
  const end = new Date(date);
  end.setDate(end.getDate() + 1);

  try {
    const orders = await Order.find({
      date: { $gte: start, $lt: end },
    }).sort({ date: 1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/orders/last", async (req, res) => {
  try {
    const lastOrder = await Order.findOne().sort({ date: -1 });
    if (!lastOrder) return res.status(404).json({ error: "No orders found" });
    res.json(lastOrder);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Inicia o servidor uma vez só
app.listen(port, () => {
  console.log(`🚀 Server running on http://localhost:${port}`);
});
