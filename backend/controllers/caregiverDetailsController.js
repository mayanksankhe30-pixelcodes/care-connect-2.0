const pool = require("../config/db");

// =========================================
// ADD CAREGIVER DETAILS
// =========================================

const addCaregiverDetails = async (req, res) => {
    try {
        const caregiverId = req.params.id;

        const {
            services = [],
            expertise = [],
            languages = [],
            working_days = []
        } = req.body;

        // Check if caregiver exists
        const [caregivers] = await pool.query(
            "SELECT id, user_id FROM caregivers WHERE id = ?",
            [caregiverId]
        );

        if (caregivers.length === 0) {
            return res.status(404).json({
                status: "error",
                message: "Caregiver not found"
            });
        }

        // Make sure the logged-in caregiver owns this profile
        if (Number(caregivers[0].user_id) !== Number(req.user.id)) {
            return res.status(403).json({
                status: "error",
                message: "You can only update your own caregiver profile"
            });
        }

        // =========================================
        // SERVICES
        // =========================================

        for (const service of services) {
            if (service && service.trim()) {
                await pool.query(
                    `INSERT INTO caregiver_services
                    (caregiver_id, service_name)
                    VALUES (?, ?)`,
                    [caregiverId, service.trim()]
                );
            }
        }

        // =========================================
        // EXPERTISE
        // =========================================

        for (const item of expertise) {
            if (item && item.trim()) {
                await pool.query(
                    `INSERT INTO caregiver_expertise
                    (caregiver_id, expertise_name)
                    VALUES (?, ?)`,
                    [caregiverId, item.trim()]
                );
            }
        }

        // =========================================
        // LANGUAGES
        // =========================================

        for (const language of languages) {
            if (language && language.trim()) {
                await pool.query(
                    `INSERT INTO caregiver_languages
                    (caregiver_id, language_name)
                    VALUES (?, ?)`,
                    [caregiverId, language.trim()]
                );
            }
        }

        // =========================================
        // WORKING DAYS
        // =========================================

        for (const day of working_days) {
            if (day && day.trim()) {
                await pool.query(
                    `INSERT INTO caregiver_days
                    (caregiver_id, day_name)
                    VALUES (?, ?)`,
                    [caregiverId, day.trim()]
                );
            }
        }

        res.status(201).json({
            status: "success",
            message: "Caregiver details added successfully"
        });

    } catch (error) {
        console.error(
            "Add caregiver details error:",
            error.message
        );

        res.status(500).json({
            status: "error",
            message: "Failed to add caregiver details"
        });
    }
};

// =========================================
// EXPORT
// =========================================

module.exports = {
    addCaregiverDetails
};