const express = require('express');
const router = express.Router();

const bcrypt = require('bcrypt');
const { User } = require('../models');
const jwt = require('jsonwebtoken');

// ==============================
// POST LOGIN
// ==============================

/**
 * @swagger
 * /login:
 *   post:
 *     summary: User login
 *     description: Authenticate a user and return a JWT token.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: "jack@example.com"
 *               password:
 *                 type: string
 *                 example: "j123m456"
 *     responses:
 *       200:
 *         description: Successful login
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   example: "eyJhbGciOiJIUzI1NiIs..."
 *       404:
 *         description: User not found
 *       401:
 *         description: Invalid password
 */

router.post('/', async (req, res) => {

    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });

    if (!user) {
        return res.status(404).json({ error: 'User not found' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
        return res.status(401).json({ error: 'Invalid password' });
    }

    const token = jwt.sign(
        { userId: user.id }, 
        process.env.JWT_SECRET, 
        { expiresIn: '1h' }
    );

    res.json({ token });
});

module.exports = router;