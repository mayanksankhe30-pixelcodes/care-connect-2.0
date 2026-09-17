const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const pool = require("../config/db");

// =========================================
// REGISTER USER
// =========================================

const registerUser = async (req, res) => {
    try {
        const { name, email, password, phone, role } = req.body;

        // Check required fields
        if (!name || !email || !password) {
            return res.status(400).json({
                message: "Name, email and password are required"
            });
        }

        // Check if email already exists
        const [existingUsers] = await pool.query(
            "SELECT id FROM users WHERE email = ?",
            [email]
        );

        if (existingUsers.length > 0) {
            return res.status(409).json({
                message: "Email already registered"
            });
        }

        // Hash password
        const passwordHash = await bcrypt.hash(password, 10);

        // Insert user
        const [result] = await pool.query(
            `INSERT INTO users
            (name, email, password_hash, phone, role)
            VALUES (?, ?, ?, ?, ?)`,
            [
                name,
                email,
                passwordHash,
                phone || null,
                role || "seeker"
            ]
        );

        res.status(201).json({
            message: "User registered successfully",
            user: {
                id: result.insertId,
                name,
                email,
                phone: phone || null,
                role: role || "seeker"
            }
        });

    } catch (error) {
        console.error("Registration error:", error.message);

        res.status(500).json({
            message: "Server error during registration"
        });
    }
};


// =========================================
// LOGIN USER
// =========================================

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check required fields
        if (!email || !password) {
            return res.status(400).json({
                message: "Email and password are required"
            });
        }

        // Find user by email
        const [users] = await pool.query(
            "SELECT * FROM users WHERE email = ?",
            [email]
        );

        if (users.length === 0) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        const user = users[0];

        // Compare password with hashed password
        const passwordMatch = await bcrypt.compare(
            password,
            user.password_hash
        );

        if (!passwordMatch) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        // =========================================
        // CREATE JWT TOKEN
        // =========================================

        const token = jwt.sign(
            {
                id: user.id,
                email: user.email,
                role: user.role
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "7d"
            }
        );

        // =========================================
        // LOGIN SUCCESSFUL
        // =========================================

        res.json({
            message: "Login successful",
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                role: user.role
            }
        });

    } catch (error) {
        console.error("Login error:", error.message);

        res.status(500).json({
            message: "Server error during login"
        });
    }
};


// =========================================
// EXPORT CONTROLLERS
// =========================================

module.exports = {
    registerUser,
    loginUser
};