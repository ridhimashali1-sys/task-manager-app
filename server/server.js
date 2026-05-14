require("dotenv").config();
require("dns").setDefaultResultOrder("ipv4first");

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

console.log("🚀 Server starting...");

// Test route
app.get("/", (req, res) => {
  res.send("Task Manager API Running");
});

// Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/tasks", require("./routes/taskRoutes"));

console.log("MONGO_URI:", process.env.MONGO_URI);

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB Connected");

    const PORT = process.env.PORT || 5000;

    app.listen(PORT, () => {
      console.log("Server running on port", PORT);
    });
  })
  .catch((err) => {
    console.log("❌ MongoDB Connection Error:", err);
  });

// Safety handlers
process.on("uncaughtException", (err) => {
  console.log("❌ Uncaught Exception:", err);
});

process.on("unhandledRejection", (err) => {
  console.log("❌ Unhandled Rejection:", err);
});