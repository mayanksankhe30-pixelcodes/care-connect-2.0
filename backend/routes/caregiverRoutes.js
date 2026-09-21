const express = require("express");
const router = express.Router();

const {
    getAllCaregivers,
    getCaregiverById,
    createCaregiver
} = require("../controllers/caregiverController");

const {
    addCaregiverDetailsd
} = require("../controllers/caregiverDetailsController");

const authMiddleware = require("../middleware/authMiddleware");

// =========================================
// CAREGIVER ROUTES
// =========================================

// Get all caregivers
router.get("/", getAllCaregivers);

// Get one caregiver
router.get("/:id", getCaregiverById);

// Create caregiver profile
router.post("/", authMiddleware, createCaregiver);

// Add services, expertise, languages & working days
router.post(
    "/:id/details",
    authMiddleware,
    addCaregiverDetails
);

module.exports = router;