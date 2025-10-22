const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema({
  drink: { type: String, required: true },
  milk: { type: String, default: null },
  syrup: { type: String, default: null },
  decaf: { type: Boolean, default: false },
  extraShot: { type: Boolean, default: false },
  date: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Order", OrderSchema);
