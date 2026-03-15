const bcrypt = require('bcrypt');
const { User } = require('../models');

app.post('/register', async (req, res) => {
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