const express = require('express');
const cors = require('cors');
const app = express();
const port = 3000;

const registerRoutes = require('./routes/register');
const loginRoutes = require('./routes/login');
const imagesRoute = require('./routes/images');

const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./config/swagger');

app.use(cors());
app.use(express.json());

app.use('/register', registerRoutes);
app.use('/login', loginRoutes);
app.use('/images', imagesRoute);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

// ==============================
// Swagger API Documentation
// ==============================
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));