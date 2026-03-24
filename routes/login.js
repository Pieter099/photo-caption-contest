const express = require('express');
const router = express.Router();

const bcrypt = require('bcrypt');
const { User } = require('../models');
const jwt = require('jsonwebtoken');

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