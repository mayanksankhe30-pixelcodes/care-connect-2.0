const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {
    getAllCaregivers,
    getCaregiverById,
    createCaregiver,
    addCaregiverDetails
} = require("../controllers/caregiverController");


// =========================================
// GET ALL / SEARCH CAREGIVERS
// GET /api/caregivers
// =========================================

router.get("/", getAllCaregivers);


// =========================================
// GET CAREGIVER BY ID
// GET /api/caregivers/:id
// =========================================

router.get("/:id", getCaregiverById);


// =========================================
// CREATE CAREGIVER PROFILE
// POST /api/caregivers
// =========================================

router.post(
    "/",
    authMiddleware,
    createCaregiver
);


// =========================================
// ADD CAREGIVER DETAILS
// POST /api/caregivers/:id/details
// =========================================

router.post(
    "/:id/details",
    authMiddleware,
    addCaregiverDetails
);


module.exports = router;