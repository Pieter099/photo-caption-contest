const express = require('express');
const cors = require('cors');
const app = express();
const port = 3000;

const registerRoutes = require('./routes/register');
const loginRoutes = require('./routes/login');
const imagesRoute = require('./routes/images');

app.use(cors());
app.use(express.json());

app.use('/register', registerRoutes);
app.use('/login', loginRoutes);
app.use('/images', imagesRoute);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});