const express = require("express");
const cors = require("cors");
require("dotenv").config();

const authRoutes = require("./routes/authRoutes");
const caregiverRoutes = require("./routes/caregiverRoutes");
const bookingRoutes = require("./routes/bookingRoutes");
const careRequirementRoutes = require("./routes/careRequirementRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const reviewRoutes = require("./routes/reviewRoutes");
const adminRoutes = require("./routes/adminRoutes");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Basic test route
app.get("/", (req, res) => {
  res.send("Care-Connect Backend is running!");
});

// Health check
app.get("/api/health", async (req, res) => {
  try {
    const pool = require("./config/db");
    await pool.query("SELECT 1");

    res.json({
      success: true,
      message: "Database connected successfully",
    });
  } catch (error) {
    console.error("Database health check failed:", error);

    res.status(500).json({
      success: false,
      message: "Database connection failed",
    });
  }
});

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/caregivers", caregiverRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/care-requirements", careRequirementRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/admin", adminRoutes);

// Server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});