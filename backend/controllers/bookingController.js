const pool = require("../config/db");

// =========================================
// CREATE BOOKING
// =========================================

const createBooking = async (req, res) => {
    const connection = await pool.getConnection();

    try {
        const {
            caregiver_id,
            requirement_id,
            booking_date,
            start_time,
            end_time
        } = req.body;

        const seekerId = req.user.id;

        if (
            !caregiver_id ||
            !booking_date ||
            !start_time ||
            !end_time
        ) {
            return res.status(400).json({
                status: "error",
                message:
                    "Caregiver, booking date, start time and end time are required"
            });
        }

        if (start_time >= end_time) {
            return res.status(400).json({
                status: "error",
                message: "End time must be after start time"
            });
        }

        await connection.beginTransaction();

        // =========================================
        // CHECK CAREGIVER
        // =========================================

        const [caregivers] = await connection.query(
            `
            SELECT
                id,
                price,
                start_time,
                end_time,
                availability_status
            FROM caregivers
            WHERE id = ?
            `,
            [caregiver_id]
        );

        if (caregivers.length === 0) {
            await connection.rollback();

            return res.status(404).json({
                status: "error",
                message: "Caregiver not found"
            });
        }

        const caregiver = caregivers[0];

        // =========================================
        // CHECK AVAILABILITY
        // =========================================

        if (
            caregiver.availability_status &&
            caregiver.availability_status
                .toLowerCase()
                .includes("unavailable")
        ) {
            await connection.rollback();

            return res.status(409).json({
                status: "error",
                message: "Caregiver is currently unavailable"
            });
        }

        // =========================================
        // CHECK WORKING DAY
        // =========================================

        const dateParts = booking_date.split("-");

        if (dateParts.length !== 3) {
            await connection.rollback();

            return res.status(400).json({
                status: "error",
                message: "Invalid booking date"
            });
        }

        const year = Number(dateParts[0]);
        const month = Number(dateParts[1]);
        const day = Number(dateParts[2]);

        const bookingDateObject = new Date(
            Date.UTC(year, month - 1, day)
        );

        const dayNames = [
            "Sunday",
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday"
        ];

        const bookingDay =
            dayNames[bookingDateObject.getUTCDay()];

        const [workingDays] = await connection.query(
            `
            SELECT day_name
            FROM caregiver_days
            WHERE caregiver_id = ?
            `,
            [caregiver_id]
        );

        const isWorkingDay = workingDays.some(
            item =>
                item.day_name.toLowerCase() ===
                bookingDay.toLowerCase()
        );

        if (!isWorkingDay) {
            await connection.rollback();

            return res.status(400).json({
                status: "error",
                message:
                    `Caregiver does not work on ${bookingDay}`
            });
        }

        // =========================================
        // CHECK WORKING HOURS
        // =========================================

        if (caregiver.start_time && caregiver.end_time) {

            if (
                start_time < caregiver.start_time ||
                end_time > caregiver.end_time
            ) {
                await connection.rollback();

                return res.status(400).json({
                    status: "error",
                    message:
                        "Booking time is outside caregiver working hours"
                });
            }
        }

        // =========================================
        // CHECK DOUBLE BOOKING
        // =========================================

        const [conflictingBookings] =
            await connection.query(
                `
                SELECT id
                FROM bookings
                WHERE caregiver_id = ?
                AND booking_date = ?
                AND status IN ('pending', 'confirmed')
                AND start_time < ?
                AND end_time > ?
                FOR UPDATE
                `,
                [
                    caregiver_id,
                    booking_date,
                    end_time,
                    start_time
                ]
            );

        if (conflictingBookings.length > 0) {
            await connection.rollback();

            return res.status(409).json({
                status: "error",
                message:
                    "Caregiver is already booked for this time"
            });
        }

        // =========================================
        // BOOKING AMOUNT
        // =========================================

        const amount = caregiver.price;

        // =========================================
        // CREATE BOOKING
        // =========================================

        const [result] = await connection.query(
            `
            INSERT INTO bookings
            (
                seeker_id,
                caregiver_id,
                requirement_id,
                booking_date,
                start_time,
                end_time,
                amount,
                status
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, 'pending')
            `,
            [
                seekerId,
                caregiver_id,
                requirement_id || null,
                booking_date,
                start_time,
                end_time,
                amount
            ]
        );

        await connection.commit();

        res.status(201).json({
            status: "success",
            message: "Booking created successfully",
            booking: {
                id: result.insertId,
                seeker_id: seekerId,
                caregiver_id,
                requirement_id: requirement_id || null,
                booking_date,
                start_time,
                end_time,
                amount,
                status: "pending"
            }
        });

    } catch (error) {

        await connection.rollback();

        console.error(
            "Create booking error:",
            error.message
        );

        res.status(500).json({
            status: "error",
            message: "Failed to create booking"
        });

    } finally {
        connection.release();
    }
};


// =========================================
// GET MY BOOKINGS - SEEKER
// =========================================

const getMyBookings = async (req, res) => {
    try {

        const userId = req.user.id;

        const [bookings] = await pool.query(
            `
            SELECT
                b.id,
                b.booking_date,
                b.start_time,
                b.end_time,
                b.amount,
                b.status,
                b.created_at,

                c.id AS caregiver_id,
                u.name AS caregiver_name,
                c.city,
                c.photo_url,
                c.rating

            FROM bookings b

            JOIN caregivers c
                ON b.caregiver_id = c.id

            JOIN users u
                ON c.user_id = u.id

            WHERE b.seeker_id = ?

            ORDER BY
                b.booking_date DESC,
                b.start_time DESC
            `,
            [userId]
        );

        res.json({
            status: "success",
            count: bookings.length,
            bookings
        });

    } catch (error) {

        console.error(
            "Get bookings error:",
            error.message
        );

        res.status(500).json({
            status: "error",
            message: "Failed to fetch bookings"
        });
    }
};


// =========================================
// GET CAREGIVER BOOKINGS
// =========================================

const getCaregiverBookings = async (req, res) => {
    try {

        const userId = req.user.id;

        // Find caregiver profile belonging to
        // logged-in user
        const [caregivers] = await pool.query(
            `
            SELECT id
            FROM caregivers
            WHERE user_id = ?
            `,
            [userId]
        );

        if (caregivers.length === 0) {
            return res.status(404).json({
                status: "error",
                message: "Caregiver profile not found"
            });
        }

        const caregiverId = caregivers[0].id;

        const [bookings] = await pool.query(
            `
            SELECT
                b.id,
                b.booking_date,
                b.start_time,
                b.end_time,
                b.amount,
                b.status,
                b.created_at,

                u.id AS seeker_id,
                u.name AS seeker_name,
                u.email AS seeker_email,
                u.phone AS seeker_phone

            FROM bookings b

            JOIN users u
                ON b.seeker_id = u.id

            WHERE b.caregiver_id = ?

            ORDER BY
                b.booking_date DESC,
                b.start_time DESC
            `,
            [caregiverId]
        );

        res.json({
            status: "success",
            count: bookings.length,
            bookings
        });

    } catch (error) {

        console.error(
            "Get caregiver bookings error:",
            error.message
        );

        res.status(500).json({
            status: "error",
            message: "Failed to fetch caregiver bookings"
        });
    }
};


// =========================================
// UPDATE BOOKING STATUS
// =========================================

const updateBookingStatus = async (req, res) => {
    try {

        const { id } = req.params;
        const { status } = req.body;

        const userId = req.user.id;

        // =========================================
        // VALID STATUS VALUES
        // =========================================

        const allowedStatuses = [
            "confirmed",
            "completed",
            "cancelled"
        ];

        if (!allowedStatuses.includes(status)) {
            return res.status(400).json({
                status: "error",
                message:
                    "Invalid status. Use confirmed, completed or cancelled"
            });
        }

        // =========================================
        // FIND CAREGIVER PROFILE
        // =========================================

        const [caregivers] = await pool.query(
            `
            SELECT id
            FROM caregivers
            WHERE user_id = ?
            `,
            [userId]
        );

        if (caregivers.length === 0) {
            return res.status(403).json({
                status: "error",
                message: "Caregiver profile not found"
            });
        }

        const caregiverId = caregivers[0].id;

        // =========================================
        // FIND BOOKING
        // =========================================

        const [bookings] = await pool.query(
            `
            SELECT id, status
            FROM bookings
            WHERE id = ?
            AND caregiver_id = ?
            `,
            [id, caregiverId]
        );

        if (bookings.length === 0) {
            return res.status(404).json({
                status: "error",
                message:
                    "Booking not found or does not belong to you"
            });
        }

        const currentStatus = bookings[0].status;

        // =========================================
        // STATUS TRANSITION VALIDATION
        // =========================================

        if (
            currentStatus === "completed" ||
            currentStatus === "cancelled"
        ) {
            return res.status(400).json({
                status: "error",
                message:
                    `Booking is already ${currentStatus}`
            });
        }

        if (
            currentStatus === "pending" &&
            status === "completed"
        ) {
            return res.status(400).json({
                status: "error",
                message:
                    "Pending booking must be confirmed first"
            });
        }

        // =========================================
        // UPDATE STATUS
        // =========================================

        await pool.query(
            `
            UPDATE bookings
            SET status = ?
            WHERE id = ?
            AND caregiver_id = ?
            `,
            [status, id, caregiverId]
        );

        res.json({
            status: "success",
            message: "Booking status updated successfully",
            booking: {
                id: Number(id),
                previous_status: currentStatus,
                status
            }
        });

    } catch (error) {

        console.error(
            "Update booking status error:",
            error.message
        );

        res.status(500).json({
            status: "error",
            message: "Failed to update booking status"
        });
    }
};


// =========================================
// EXPORT
// =========================================

module.exports = {
    createBooking,
    getMyBookings,
    getCaregiverBookings,
    updateBookingStatus
};