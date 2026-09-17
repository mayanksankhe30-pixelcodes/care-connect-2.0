const express = require("express");

const router = express.Router();

const {
    getAllUsers,
    getAllBookings,
    getAllPayments,
    getAllReviews,
    deleteCaregiver
} = require("../controllers/adminController");

const authMiddleware = require("../middleware/authMiddleware");

// Admin-only middleware
const adminOnly = (req, res, next) => {
    if (req.user.role !== "admin") {
        return res.status(403).json({
            status: "error",
            message: "Admin access required"
        });
    }

    next();
};


// =========================================
// GET ALL USERS
// =========================================
router.get(
    "/users",
    authMiddleware,
    adminOnly,
    getAllUsers
);


// =========================================
// GET ALL BOOKINGS
// =========================================
router.get(
    "/bookings",
    authMiddleware,
    adminOnly,
    getAllBookings
);


// =========================================
// GET ALL PAYMENTS
// =========================================
router.get(
    "/payments",
    authMiddleware,
    adminOnly,
    getAllPayments
);


// =========================================
// GET ALL REVIEWS
// =========================================
router.get(
    "/reviews",
    authMiddleware,
    adminOnly,
    getAllReviews
);


// =========================================
// DELETE CAREGIVER
// =========================================
router.delete(
    "/caregivers/:id",
    authMiddleware,
    adminOnly,
    deleteCaregiver
);


module.exports = router;