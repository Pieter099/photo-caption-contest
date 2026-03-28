const express = require('express');
const router = express.Router();

const bcrypt = require('bcrypt');
const { User } = require('../models');
const jwt = require('jsonwebtoken');

// ==============================
// POST LOGIN
// ==============================
/** @swagger
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
 *             properties:
 *               email:
 *                 type: string
 *                 example: "user@example.com"
 *              password:
 *                 type: string
 *                 example: "password123"
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
 *                   example: "your_jwt_token"
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
        "yourSecretKey", 
        { expiresIn: '1h' }
    );

    res.json({ token });
});

module.exports = router;