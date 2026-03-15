const jwt = require('jsonwebtoken');

app.post('/login', async (req, res) => {

    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });

    if (!user) {
        return res.status(404).json({ error: 'User not found' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
        return res.status(401).json({ error: 'Invalid password' });
    }

    const token = jwt.sign({ 
        userId: user.id }, 
        "supersecretKey", 
        { expiresIn: '1h' }
    );

    res.json({ token });
});