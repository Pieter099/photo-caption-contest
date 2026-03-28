const express = require('express');
const router = express.Router();

const bcrypt = require('bcrypt');
const { User } = require('../models');

// ==============================
// POST REGISTER
// ==============================
/** @swagger
 * /register:
 *   post:
 *     summary: User registration
 *     description: Register a new user with username, email, and password.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 example: "john_doe"
 *               email:
 *                 type: string
 *                 example: "john@example.com"
 *               password:
 *                 type: string
 *                 example: "password123"
 *     responses:
 *       201:
 *         description: User registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "User registered successfully"
 *                 userId:
 *                   type: string
 *                   example: "user_id"
 *       500:
 *         description: Internal server error
 */

router.post('/', async (req, res) => {
    try {
        const { username,email,  password } = req.body;

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            username,
            email,
            password: hashedPassword
        });

        res.status(201).json({ 
            message: 'User registered successfully', 
            userId: user.id 
        });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;