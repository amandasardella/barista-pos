const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
const port = 3000;

mongoose.connect(
  "mongodb+srv://amandansardella:mKnvpFA3gpBZmGFe@barista-pos.mdrl1mk.mongodb.net/?retryWrites=true&w=majority&appName=barista-pos"
);

app.use(cors());
app.use(express.json());

const OrderSchema = new mongoose.Schema({
  drink: { type: String, required: true },
  milk: { type: String, default: null },
  syrup: { type: String, default: null },
  decaf: { type: Boolean, default: false },
  extraShot: { type: Boolean, default: false },
  date: { type: Date, default: Date.now },
});
const Order = mongoose.model("Order", OrderSchema);

app.get("/", async (req, res) => {
  const orders = await Order.find();
  res.send(orders);
});

app.delete("/:id", async (req, res) => {
  const order = await Order.findByIdAndDelete(req.params.id);
  res.send(order);
});

app.put("/:id", async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      {
        drink: req.body.drink,
        milk: req.body.milk,
        syrup: req.body.syrup,
        decaf: req.body.decaf,
        extraShot: req.body.extraShot,
      },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    res.json(order);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.post("/", async (req, res) => {
  console.log("POST / received body:", req.body); // <-- Log para depurar
  try {
    const order = new Order({
      drink: req.body.drink,
      milk: req.body.milk,
      syrup: req.body.syrup,
      decaf: req.body.decaf,
      extraShot: req.body.extraShot,
    });

    const saved = await order.save();
    console.log("Order saved:", saved); // <-- Log para confirmar salvamento
    res.status(201).json(saved);
  } catch (err) {
    console.error("Error saving order:", err); // <-- Log de erro
    res.status(400).json({ error: err.message });
  }
});

app.get("/by-date", async (req, res) => {
  const { date } = req.query;

  if (!date) {
    return res.status(400).json({ error: "Data não fornecida" });
  }

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

app.get("/last-order", async (req, res) => {
  try {
    const lastOrder = await Order.findOne().sort({ date: -1 });
    if (!lastOrder) {
      return res.status(404).json({ error: "No orders found" });
    }
    res.json(lastOrder);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(port, () => {
  console.log(`App running on http://localhost:${port}`);
});
