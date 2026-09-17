const express = require("express");
const router = express.Router();

const {
    createBooking,
    getMyBookings,
    getCaregiverBookings,
    updateBookingStatus
} = require("../controllers/bookingController");

const authMiddleware = require("../middleware/authMiddleware");

// =========================================
// BOOKING ROUTES
// =========================================

// Create a booking
router.post("/", authMiddleware, createBooking);

// Get bookings for the logged-in seeker
router.get("/my", authMiddleware, getMyBookings);

// Get bookings assigned to the logged-in caregiver
router.get(
    "/caregiver",
    authMiddleware,
    getCaregiverBookings
);

// Update booking status
router.patch(
    "/:id/status",
    authMiddleware,
    updateBookingStatus
);

module.exports = router;