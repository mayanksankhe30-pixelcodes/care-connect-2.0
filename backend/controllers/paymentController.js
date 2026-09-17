const pool = require("../config/db");

// Create a payment
const createPayment = async (req, res) => {
    try {
        const {
            booking_id,
            payment_method,
            transaction_id
        } = req.body;

        // Validate required fields
        if (!booking_id || !payment_method) {
            return res.status(400).json({
                status: "error",
                message: "Booking ID and payment method are required"
            });
        }

        // Check if booking exists
        const [bookings] = await pool.query(
            `SELECT id, seeker_id, amount, status
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

        // Only the seeker who owns the booking can make payment
        if (Number(booking.seeker_id) !== Number(req.user.id)) {
            return res.status(403).json({
                status: "error",
                message: "You can only pay for your own booking"
            });
        }

        // Check if payment already exists
        const [existingPayments] = await pool.query(
            `SELECT id, payment_status
             FROM payments
             WHERE booking_id = ?`,
            [booking_id]
        );

        if (existingPayments.length > 0) {
            return res.status(400).json({
                status: "error",
                message: "Payment already exists for this booking"
            });
        }

        // Create payment
        const [result] = await pool.query(
            `INSERT INTO payments
            (booking_id, amount, payment_status, payment_method, transaction_id)
            VALUES (?, ?, 'paid', ?, ?)`,
            [
                booking_id,
                booking.amount,
                payment_method,
                transaction_id || null
            ]
        );

        res.status(201).json({
            status: "success",
            message: "Payment created successfully",
            payment: {
                id: result.insertId,
                booking_id,
                amount: booking.amount,
                payment_status: "paid",
                payment_method,
                transaction_id: transaction_id || null
            }
        });

    } catch (error) {
        console.error("Create payment error:", error.message);

        res.status(500).json({
            status: "error",
            message: "Failed to create payment"
        });
    }
};


// Get payments for logged-in seeker
const getMyPayments = async (req, res) => {
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
             JOIN bookings b ON p.booking_id = b.id
             WHERE b.seeker_id = ?
             ORDER BY p.created_at DESC`,
            [req.user.id]
        );

        res.json({
            status: "success",
            count: payments.length,
            payments
        });

    } catch (error) {
        console.error("Get my payments error:", error.message);

        res.status(500).json({
            status: "error",
            message: "Failed to fetch payments"
        });
    }
};


module.exports = {
    createPayment,
    getMyPayments
};