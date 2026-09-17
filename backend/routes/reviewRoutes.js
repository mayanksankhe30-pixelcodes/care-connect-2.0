const express = require("express");

const router = express.Router();

const {
    createReview,
    getCaregiverReviews
} = require("../controllers/reviewController");

const authMiddleware = require("../middleware/authMiddleware");

// Create review
router.post("/", authMiddleware, createReview);

// Get reviews for a caregiver
router.get("/caregiver/:caregiverId", getCaregiverReviews);

module.exports = router;