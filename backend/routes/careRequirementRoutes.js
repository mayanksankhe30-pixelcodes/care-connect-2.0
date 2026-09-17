const express = require("express");
const router = express.Router();

const {
    createCareRequirement,
    getMyCareRequirements,
    getCareRequirementById,
    updateCareRequirement,
    deleteCareRequirement
} = require("../controllers/careRequirementController");

const authMiddleware = require("../middleware/authMiddleware");

// =========================================
// CARE REQUIREMENT ROUTES
// =========================================

// Create requirement
router.post(
    "/",
    authMiddleware,
    createCareRequirement
);

// Get all requirements of logged-in seeker
router.get(
    "/my",
    authMiddleware,
    getMyCareRequirements
);

// Get one requirement
router.get(
    "/:id",
    authMiddleware,
    getCareRequirementById
);

// Update requirement
router.put(
    "/:id",
    authMiddleware,
    updateCareRequirement
);

// Delete requirement
router.delete(
    "/:id",
    authMiddleware,
    deleteCareRequirement
);

module.exports = router;