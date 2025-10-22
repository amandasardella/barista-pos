const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// mongodb connection
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err.message));

// import and use routes
const orderRoutes = require("./routes/orders.cjs");
app.use("/orders", orderRoutes);

// test route
app.get("/", (req, res) => {
  res.send("☕ Barista PoS backend is running!");
});

// start server
app.listen(port, () => {
  console.log(`🚀 Server running on http://localhost:${port}`);
});
