const pool = require("../config/db");

// Create a review
const createReview = async (req, res) => {
    try {
        const {
            booking_id,
            rating,
            comment
        } = req.body;

        // Validate required fields
        if (!booking_id || rating === undefined) {
            return res.status(400).json({
                status: "error",
                message: "Booking ID and rating are required"
            });
        }

        // Validate rating
        if (Number(rating) < 1 || Number(rating) > 5) {
            return res.status(400).json({
                status: "error",
                message: "Rating must be between 1 and 5"
            });
        }

        // Check booking
        const [bookings] = await pool.query(
            `SELECT id, seeker_id, caregiver_id, status
             FROM bookings
             WHERE id = ?`,
            [booking_id]
        );

        if (bookings.length === 0) {
            return res.status(404).json({
                status: "error",
                message: "Booking not found"
            });
        }

        const booking = bookings[0];

        // Only the seeker who owns the booking can review
        if (Number(booking.seeker_id) !== Number(req.user.id)) {
            return res.status(403).json({
                status: "error",
                message: "You can only review your own booking"
            });
        }

        // Review only after completed booking
        if (booking.status !== "completed") {
            return res.status(400).json({
                status: "error",
                message: "You can only review a completed booking"
            });
        }

        // Check if review already exists
        const [existingReviews] = await pool.query(
            `SELECT id
             FROM reviews
             WHERE booking_id = ?`,
            [booking_id]
        );

        if (existingReviews.length > 0) {
            return res.status(400).json({
                status: "error",
                message: "Review already exists for this booking"
            });
        }

        // Create review
        const [result] = await pool.query(
            `INSERT INTO reviews
            (booking_id, seeker_id, caregiver_id, rating, comment)
            VALUES (?, ?, ?, ?, ?)`,
            [
                booking_id,
                booking.seeker_id,
                booking.caregiver_id,
                Number(rating),
                comment || null
            ]
        );

        res.status(201).json({
            status: "success",
            message: "Review created successfully",
            review: {
                id: result.insertId,
                booking_id,
                seeker_id: booking.seeker_id,
                caregiver_id: booking.caregiver_id,
                rating: Number(rating),
                comment: comment || null
            }
        });

    } catch (error) {
        console.error("Create review error:", error.message);

        res.status(500).json({
            status: "error",
            message: "Failed to create review"
        });
    }
};


// Get reviews for a caregiver
const getCaregiverReviews = async (req, res) => {
    try {
        const caregiverId = req.params.caregiverId;

        const [reviews] = await pool.query(
            `SELECT
                r.id,
                r.booking_id,
                r.rating,
                r.comment,
                r.created_at,
                u.name AS seeker_name
             FROM reviews r
             JOIN users u ON r.seeker_id = u.id
             WHERE r.caregiver_id = ?
             ORDER BY r.created_at DESC`,
            [caregiverId]
        );

        res.json({
            status: "success",
            count: reviews.length,
            reviews
        });

    } catch (error) {
        console.error("Get caregiver reviews error:", error.message);

        res.status(500).json({
            status: "error",
            message: "Failed to fetch caregiver reviews"
        });
    }
};


module.exports = {
    createReview,
    getCaregiverReviews
};