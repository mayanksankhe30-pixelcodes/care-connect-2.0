const pool = require("../config/db");

// =========================================
// Get all users
// =========================================
const getAllUsers = async (req, res) => {
    try {
        const [users] = await pool.query(
            `SELECT id, name, email, phone, role, created_at
             FROM users
             ORDER BY created_at DESC`
        );

        res.json({
            status: "success",
            count: users.length,
            users
        });

    } catch (error) {
        console.error("Get all users error:", error.message);

        res.status(500).json({
            status: "error",
            message: "Failed to fetch users"
        });
    }
};


// =========================================
// Get all bookings
// =========================================
const getAllBookings = async (req, res) => {
    try {
        const [bookings] = await pool.query(
            `SELECT
                b.id,
                b.booking_date,
                b.start_time,
                b.end_time,
                b.amount,
                b.status,
                b.created_at,
                s.name AS seeker_name,
                s.email AS seeker_email,
                c.id AS caregiver_id,
                u.name AS caregiver_name,
                u.email AS caregiver_email
             FROM bookings b
             JOIN users s ON b.seeker_id = s.id
             JOIN caregivers c ON b.caregiver_id = c.id
             JOIN users u ON c.user_id = u.id
             ORDER BY b.created_at DESC`
        );

        res.json({
            status: "success",
            count: bookings.length,
            bookings
        });

    } catch (error) {
        console.error("Get all bookings error:", error.message);

        res.status(500).json({
            status: "error",
            message: "Failed to fetch bookings"
        });
    }
};


// =========================================
// Get all payments
// =========================================
const getAllPayments = async (req, res) => {
    try {
        const [payments] = await pool.query(
            `SELECT
                p.id,
                p.booking_id,
                p.amount,
                p.payment_status,
                p.payment_method,
                p.transaction_id,
                p.paid_at,
                p.created_at
             FROM payments p
             ORDER BY p.created_at DESC`
        );

        res.json({
            status: "success",
            count: payments.length,
            payments
        });

    } catch (error) {
        console.error("Get all payments error:", error.message);

        res.status(500).json({
            status: "error",
            message: "Failed to fetch payments"
        });
    }
};


// =========================================
// Get all reviews
// =========================================
const getAllReviews = async (req, res) => {
    try {
        const [reviews] = await pool.query(
            `SELECT
                r.id,
                r.booking_id,
                r.rating,
                r.comment,
                r.created_at,
                s.name AS seeker_name,
                u.name AS caregiver_name
             FROM reviews r
             JOIN users s ON r.seeker_id = s.id
             JOIN caregivers c ON r.caregiver_id = c.id
             JOIN users u ON c.user_id = u.id
             ORDER BY r.created_at DESC`
        );

        res.json({
            status: "success",
            count: reviews.length,
            reviews
        });

    } catch (error) {
        console.error("Get all reviews error:", error.message);

        res.status(500).json({
            status: "error",
            message: "Failed to fetch reviews"
        });
    }
};


// =========================================
// Delete caregiver
// =========================================
const deleteCaregiver = async (req, res) => {
    const connection = await pool.getConnection();

    try {
        const { id } = req.params;

        await connection.beginTransaction();

        // Find caregiver and linked user
        const [caregivers] = await connection.query(
            `SELECT user_id
             FROM caregivers
             WHERE id = ?`,
            [id]
        );

        if (caregivers.length === 0) {
            await connection.rollback();

            return res.status(404).json({
                status: "error",
                message: "Caregiver not found"
            });
        }

        const userId = caregivers[0].user_id;


        // Delete reviews
        await connection.query(
            `DELETE FROM reviews
             WHERE caregiver_id = ?`,
            [id]
        );


        // Delete payments belonging to this caregiver's bookings
        await connection.query(
            `DELETE FROM payments
             WHERE booking_id IN (
                 SELECT id
                 FROM bookings
                 WHERE caregiver_id = ?
             )`,
            [id]
        );


        // Delete bookings
        await connection.query(
            `DELETE FROM bookings
             WHERE caregiver_id = ?`,
            [id]
        );


        // Delete caregiver services
        await connection.query(
            `DELETE FROM caregiver_services
             WHERE caregiver_id = ?`,
            [id]
        );


        // Delete caregiver expertise
        await connection.query(
            `DELETE FROM caregiver_expertise
             WHERE caregiver_id = ?`,
            [id]
        );


        // Delete caregiver languages
        await connection.query(
            `DELETE FROM caregiver_languages
             WHERE caregiver_id = ?`,
            [id]
        );


        // Delete caregiver working days
        await connection.query(
            `DELETE FROM caregiver_days
             WHERE caregiver_id = ?`,
            [id]
        );


        // Delete caregiver profile
        await connection.query(
            `DELETE FROM caregivers
             WHERE id = ?`,
            [id]
        );


        // Delete linked user account
        await connection.query(
            `DELETE FROM users
             WHERE id = ?`,
            [userId]
        );


        await connection.commit();

        res.json({
            status: "success",
            message: "Caregiver deleted successfully"
        });

    } catch (error) {

        await connection.rollback();

        console.error(
            "Delete caregiver error:",
            error.message
        );

        res.status(500).json({
            status: "error",
            message: "Failed to delete caregiver"
        });

    } finally {
        connection.release();
    }
};


// =========================================
// EXPORT
// =========================================
module.exports = {
    getAllUsers,
    getAllBookings,
    getAllPayments,
    getAllReviews,
    deleteCaregiver
};