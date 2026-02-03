const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");

// Load environment variables from .env file
dotenv.config();
console.log('MongoDB URI from .env:', process.env.MONGO_URI);

const app = express();

// Middleware
app.use(cors());
app.use(express.json()); // To accept JSON data from frontend

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected successfully"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));
// Top of file
const donorRoutes = require("./routes/donorRoutes");
const recipientRoutes = require("./routes/recipientRoutes");
const requestRoutes = require("./routes/requestRoutes");
const donationRoutes = require("./routes/donationRoutes");
const transfusionRoutes = require("./routes/transfusionRoutes");

// Below middleware setup
app.use("/api/donors", donorRoutes);
app.use("/api/recipients", recipientRoutes);
app.use("/api/requests", requestRoutes);
app.use("/api/donations", donationRoutes);
app.use("/api/transfusions", transfusionRoutes);

const path = require('path');

app.use(express.static(path.join(__dirname, 'public')));

// Simple Route (Test)
app.get("/", (req, res) => {
  res.send("🚀 Blood Bank API is running");
});

// Donor Routes will be added here later
// app.use('/api/donors', require('./routes/donorRoutes'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});