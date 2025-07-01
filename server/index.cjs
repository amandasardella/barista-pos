require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
const port = 3000;

//var of ONGODB_URI
const uri = process.env.MONGODB_URI;

if (!uri) {
  console.error("MONGODB_URI is not defined. Check your .env file!");
  process.exit(1);
}

mongoose
  .connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err.message);
    process.exit(1);
  });

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
  console.log("POST / received body:", req.body);
  try {
    const order = new Order({
      drink: req.body.drink,
      milk: req.body.milk,
      syrup: req.body.syrup,
      decaf: req.body.decaf,
      extraShot: req.body.extraShot,
    });

    const saved = await order.save();
    console.log("Order saved:", saved);
    res.status(201).json(saved);
  } catch (err) {
    console.error("Error saving order:", err);
    res.status(400).json({ error: err.message });
  }
});

app.get("/by-date", async (req, res) => {
  const { date } = req.query;

  if (!date) {
    return res.status(400).json({ error: "Date not provided" });
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
