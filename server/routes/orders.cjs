const express = require("express");
const router = express.Router();
const Order = require("../models/Order.cjs");

// GET all orders
router.get("/", async (req, res) => {
  const orders = await Order.find();
  res.json(orders);
});

// POST new order
router.post("/", async (req, res) => {
  try {
    const order = new Order(req.body);
    const saved = await order.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE order by ID
router.delete("/:id", async (req, res) => {
  const order = await Order.findByIdAndDelete(req.params.id);
  res.json(order);
});

// PUT update order
router.put("/:id", async (req, res) => {
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

// GET orders by date
router.get("/by-date", async (req, res) => {
  const { date } = req.query;
  if (!date) return res.status(400).json({ error: "Date not provided" });

  const start = new Date(date);
  const end = new Date(date);
  end.setDate(end.getDate() + 1);

  try {
    const orders = await Order.find({ date: { $gte: start, $lt: end } }).sort({
      date: 1,
    });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET last order
router.get("/last", async (req, res) => {
  try {
    const lastOrder = await Order.findOne().sort({ date: -1 });
    if (!lastOrder) return res.status(404).json({ error: "No orders found" });
    res.json(lastOrder);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
