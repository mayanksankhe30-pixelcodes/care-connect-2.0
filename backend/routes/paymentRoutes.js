const express = require("express");

const router = express.Router();

const {
    createPayment,
    getMyPayments
} = require("../controllers/paymentController");

const authMiddleware = require("../middleware/authMiddleware");

// Create payment
router.post("/", authMiddleware, createPayment);

// Get payments of logged-in seeker
router.get("/my", authMiddleware, getMyPayments);

module.exports = router;