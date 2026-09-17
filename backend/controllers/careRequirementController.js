const pool = require("../config/db");

// =========================================
// CREATE CARE REQUIREMENT
// =========================================

const createCareRequirement = async (req, res) => {
    try {
        const {
            care_type,
            location,
            start_date,
            end_date,
            preferred_start_time,
            preferred_end_time,
            notes
        } = req.body;

        const seekerId = req.user.id;

        // Only seekers can create care requirements
        if (req.user.role !== "seeker") {
            return res.status(403).json({
                status: "error",
                message: "Only seekers can create care requirements"
            });
        }

        if (!care_type || !location) {
            return res.status(400).json({
                status: "error",
                message: "Care type and location are required"
            });
        }

        if (start_date && end_date && start_date > end_date) {
            return res.status(400).json({
                status: "error",
                message: "End date must be after or equal to start date"
            });
        }

        if (
            preferred_start_time &&
            preferred_end_time &&
            preferred_start_time >= preferred_end_time
        ) {
            return res.status(400).json({
                status: "error",
                message: "Preferred end time must be after start time"
            });
        }

        const [result] = await pool.query(
            `
            INSERT INTO care_requirements
            (
                seeker_id,
                care_type,
                location,
                start_date,
                end_date,
                preferred_start_time,
                preferred_end_time,
                notes
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            `,
            [
                seekerId,
                care_type,
                location,
                start_date || null,
                end_date || null,
                preferred_start_time || null,
                preferred_end_time || null,
                notes || null
            ]
        );

        res.status(201).json({
            status: "success",
            message: "Care requirement created successfully",
            requirement: {
                id: result.insertId,
                seeker_id: seekerId,
                care_type,
                location,
                start_date: start_date || null,
                end_date: end_date || null,
                preferred_start_time:
                    preferred_start_time || null,
                preferred_end_time:
                    preferred_end_time || null,
                notes: notes || null
            }
        });

    } catch (error) {
        console.error(
            "Create care requirement error:",
            error.message
        );

        res.status(500).json({
            status: "error",
            message: "Failed to create care requirement"
        });
    }
};


// =========================================
// GET MY CARE REQUIREMENTS
// =========================================

const getMyCareRequirements = async (req, res) => {
    try {
        const seekerId = req.user.id;

        if (req.user.role !== "seeker") {
            return res.status(403).json({
                status: "error",
                message: "Only seekers can view care requirements"
            });
        }

        const [requirements] = await pool.query(
            `
            SELECT
                id,
                care_type,
                location,
                start_date,
                end_date,
                preferred_start_time,
                preferred_end_time,
                notes,
                created_at
            FROM care_requirements
            WHERE seeker_id = ?
            ORDER BY created_at DESC
            `,
            [seekerId]
        );

        res.json({
            status: "success",
            count: requirements.length,
            requirements
        });

    } catch (error) {
        console.error(
            "Get care requirements error:",
            error.message
        );

        res.status(500).json({
            status: "error",
            message: "Failed to fetch care requirements"
        });
    }
};


// =========================================
// GET SINGLE CARE REQUIREMENT
// =========================================

const getCareRequirementById = async (req, res) => {
    try {
        const { id } = req.params;
        const seekerId = req.user.id;

        const [requirements] = await pool.query(
            `
            SELECT
                id,
                care_type,
                location,
                start_date,
                end_date,
                preferred_start_time,
                preferred_end_time,
                notes,
                created_at
            FROM care_requirements
            WHERE id = ?
            AND seeker_id = ?
            `,
            [id, seekerId]
        );

        if (requirements.length === 0) {
            return res.status(404).json({
                status: "error",
                message: "Care requirement not found"
            });
        }

        res.json({
            status: "success",
            requirement: requirements[0]
        });

    } catch (error) {
        console.error(
            "Get care requirement error:",
            error.message
        );

        res.status(500).json({
            status: "error",
            message: "Failed to fetch care requirement"
        });
    }
};


// =========================================
// UPDATE CARE REQUIREMENT
// =========================================

const updateCareRequirement = async (req, res) => {
    try {
        const { id } = req.params;
        const seekerId = req.user.id;

        const {
            care_type,
            location,
            start_date,
            end_date,
            preferred_start_time,
            preferred_end_time,
            notes
        } = req.body;

        const [existing] = await pool.query(
            `
            SELECT id
            FROM care_requirements
            WHERE id = ?
            AND seeker_id = ?
            `,
            [id, seekerId]
        );

        if (existing.length === 0) {
            return res.status(404).json({
                status: "error",
                message: "Care requirement not found"
            });
        }

        if (start_date && end_date && start_date > end_date) {
            return res.status(400).json({
                status: "error",
                message: "End date must be after or equal to start date"
            });
        }

        if (
            preferred_start_time &&
            preferred_end_time &&
            preferred_start_time >= preferred_end_time
        ) {
            return res.status(400).json({
                status: "error",
                message: "Preferred end time must be after start time"
            });
        }

        await pool.query(
            `
            UPDATE care_requirements
            SET
                care_type = ?,
                location = ?,
                start_date = ?,
                end_date = ?,
                preferred_start_time = ?,
                preferred_end_time = ?,
                notes = ?
            WHERE id = ?
            AND seeker_id = ?
            `,
            [
                care_type,
                location,
                start_date || null,
                end_date || null,
                preferred_start_time || null,
                preferred_end_time || null,
                notes || null,
                id,
                seekerId
            ]
        );

        res.json({
            status: "success",
            message: "Care requirement updated successfully"
        });

    } catch (error) {
        console.error(
            "Update care requirement error:",
            error.message
        );

        res.status(500).json({
            status: "error",
            message: "Failed to update care requirement"
        });
    }
};


// =========================================
// DELETE CARE REQUIREMENT
// =========================================

const deleteCareRequirement = async (req, res) => {
    try {
        const { id } = req.params;
        const seekerId = req.user.id;

        const [result] = await pool.query(
            `
            DELETE FROM care_requirements
            WHERE id = ?
            AND seeker_id = ?
            `,
            [id, seekerId]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                status: "error",
                message: "Care requirement not found"
            });
        }

        res.json({
            status: "success",
            message: "Care requirement deleted successfully"
        });

    } catch (error) {
        console.error(
            "Delete care requirement error:",
            error.message
        );

        res.status(500).json({
            status: "error",
            message: "Failed to delete care requirement"
        });
    }
};


// =========================================
// EXPORT
// =========================================

module.exports = {
    createCareRequirement,
    getMyCareRequirements,
    getCareRequirementById,
    updateCareRequirement,
    deleteCareRequirement
};