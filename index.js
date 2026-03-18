const express = require('express');
const cors = require('cors');
const app = express();
const port = 3000;

const registerRoutes = require('./routes/register');

app.use(cors());
app.use(express.json());

app.use('/register', registerRoutes);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});