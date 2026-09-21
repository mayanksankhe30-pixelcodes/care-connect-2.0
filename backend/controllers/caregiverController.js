const pool = require("../config/db");

// =========================================
// GET ALL / SEARCH CAREGIVERS
// =========================================

const getAllCaregivers = async (req, res) => {
    try {
        const {
            city,
            specialization,
            maxBudget,
            availability
        } = req.query;

        let query = `
            SELECT
                c.id AS caregiver_id,
                u.id AS user_id,
                u.name,
                u.email,
                u.phone,
                c.city,
                c.experience,
                c.qualifications,
                c.bio,
                c.price,
                c.photo_url,
                c.verified,
                c.rating,
                c.reviews_count,
                c.availability_status,
                c.start_time,
                c.end_time
            FROM caregivers c
            JOIN users u ON c.user_id = u.id
            WHERE 1 = 1
        `;

        const params = [];

        // =========================================
        // LOCATION FILTER
        // =========================================

        if (city && city.trim()) {
            query += ` AND LOWER(c.city) = LOWER(?)`;
            params.push(city.trim());
        }

        // =========================================
        // MAXIMUM BUDGET FILTER
        // =========================================

        if (maxBudget !== undefined && maxBudget !== "") {
            const budget = Number(maxBudget);

            if (Number.isNaN(budget) || budget < 0) {
                return res.status(400).json({
                    status: "error",
                    message: "Invalid maximum budget"
                });
            }

            query += ` AND c.price <= ?`;
            params.push(budget);
        }

        // =========================================
        // SPECIALIZATION FILTER
        // Searches both services and expertise
        // =========================================

        if (specialization && specialization.trim()) {
            query += `
                AND (
                    EXISTS (
                        SELECT 1
                        FROM caregiver_services cs
                        WHERE cs.caregiver_id = c.id
                        AND LOWER(cs.service_name) LIKE LOWER(?)
                    )
                    OR
                    EXISTS (
                        SELECT 1
                        FROM caregiver_expertise ce
                        WHERE ce.caregiver_id = c.id
                        AND LOWER(ce.expertise_name) LIKE LOWER(?)
                    )
                )
            `;

            const specializationSearch = `%${specialization.trim()}%`;

            params.push(specializationSearch);
            params.push(specializationSearch);
        }

        // =========================================
        // AVAILABILITY FILTER
        // =========================================

        if (availability && availability.trim()) {
            query += `
                AND LOWER(c.availability_status)
                LIKE LOWER(?)
            `;

            params.push(`%${availability.trim()}%`);
        }

        // =========================================
        // ORDER
        // =========================================

        query += ` ORDER BY c.created_at DESC`;

        // =========================================
        // EXECUTE QUERY
        // =========================================

        const [caregivers] = await pool.query(query, params);

        // =========================================
        // ADD RELATED DETAILS
        // =========================================

        for (const caregiver of caregivers) {

            const [services] = await pool.query(
                `SELECT service_name
                 FROM caregiver_services
                 WHERE caregiver_id = ?`,
                [caregiver.caregiver_id]
            );

            const [expertise] = await pool.query(
                `SELECT expertise_name
                 FROM caregiver_expertise
                 WHERE caregiver_id = ?`,
                [caregiver.caregiver_id]
            );

            const [languages] = await pool.query(
                `SELECT language_name
                 FROM caregiver_languages
                 WHERE caregiver_id = ?`,
                [caregiver.caregiver_id]
            );

            const [days] = await pool.query(
                `SELECT day_name
                 FROM caregiver_days
                 WHERE caregiver_id = ?`,
                [caregiver.caregiver_id]
            );

            caregiver.services =
                services.map(item => item.service_name);

            caregiver.expertise =
                expertise.map(item => item.expertise_name);

            caregiver.languages =
                languages.map(item => item.language_name);

            caregiver.working_days =
                days.map(item => item.day_name);
        }

        res.json({
            status: "success",
            count: caregivers.length,
            filters: {
                city: city || null,
                specialization: specialization || null,
                maxBudget: maxBudget || null,
                availability: availability || null
            },
            caregivers
        });

    } catch (error) {
        console.error(
            "Search caregivers error:",
            error.message
        );

        res.status(500).json({
            status: "error",
            message: "Failed to fetch caregivers"
        });
    }
};


// =========================================
// GET CAREGIVER BY ID
// =========================================

const getCaregiverById = async (req, res) => {
    try {
        const { id } = req.params;

        const [caregivers] = await pool.query(
            `
            SELECT
                c.id AS caregiver_id,
                u.id AS user_id,
                u.name,
                u.email,
                u.phone,
                c.city,
                c.experience,
                c.qualifications,
                c.bio,
                c.price,
                c.photo_url,
                c.verified,
                c.rating,
                c.reviews_count,
                c.availability_status,
                c.start_time,
                c.end_time
            FROM caregivers c
            JOIN users u ON c.user_id = u.id
            WHERE c.id = ?
            `,
            [id]
        );

        if (caregivers.length === 0) {
            return res.status(404).json({
                status: "error",
                message: "Caregiver not found"
            });
        }

        const caregiver = caregivers[0];

        const [services] = await pool.query(
            `SELECT service_name
             FROM caregiver_services
             WHERE caregiver_id = ?`,
            [id]
        );

        const [expertise] = await pool.query(
            `SELECT expertise_name
             FROM caregiver_expertise
             WHERE caregiver_id = ?`,
            [id]
        );

        const [languages] = await pool.query(
            `SELECT language_name
             FROM caregiver_languages
             WHERE caregiver_id = ?`,
            [id]
        );

        const [days] = await pool.query(
            `SELECT day_name
             FROM caregiver_days
             WHERE caregiver_id = ?`,
            [id]
        );

        caregiver.services =
            services.map(item => item.service_name);

        caregiver.expertise =
            expertise.map(item => item.expertise_name);

        caregiver.languages =
            languages.map(item => item.language_name);

        caregiver.working_days =
            days.map(item => item.day_name);

        res.json({
            status: "success",
            caregiver
        });

    } catch (error) {
        console.error(
            "Get caregiver error:",
            error.message
        );

        res.status(500).json({
            status: "error",
            message: "Failed to fetch caregiver"
        });
    }
};


// =========================================
// CREATE CAREGIVER PROFILE
// =========================================

const createCaregiver = async (req, res) => {
    try {
        const {
            city,
            experience,
            qualifications,
            bio,
            price,
            photo_url,
            start_time,
            end_time,
            availability_status
        } = req.body;

        const userId = req.user.id;

        if (req.user.role !== "caregiver") {
            return res.status(403).json({
                status: "error",
                message: "Only caregivers can create a caregiver profile"
            });
        }

        if (!city || price === undefined) {
            return res.status(400).json({
                status: "error",
                message: "City and price are required"
            });
        }

        const [existing] = await pool.query(
            "SELECT id FROM caregivers WHERE user_id = ?",
            [userId]
        );

        if (existing.length > 0) {
            return res.status(409).json({
                status: "error",
                message: "Caregiver profile already exists"
            });
        }

        const [result] = await pool.query(
            `
            INSERT INTO caregivers
            (
                user_id,
                city,
                experience,
                qualifications,
                bio,
                price,
                photo_url,
                start_time,
                end_time,
                availability_status
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `,
            [
                userId,
                city,
                experience || 0,
                qualifications || null,
                bio || null,
                price,
                photo_url || null,
                start_time || null,
                end_time || null,
                availability_status || "Available for bookings"
            ]
        );

        res.status(201).json({
            status: "success",
            message: "Caregiver profile created successfully",
            caregiver_id: result.insertId
        });

    } catch (error) {
        console.error(
            "Create caregiver error:",
            error.message
        );

        res.status(500).json({
            status: "error",
            message: "Failed to create caregiver profile"
        });
    }
};


// =========================================
// EXPORT
// =========================================
module.exports = {
    getAllCaregivers,
    getCaregiverById,
    createCaregiver,
    addCaregiverDetails: createCaregiver
};