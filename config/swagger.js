const swaggerJSDoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Photo Caption Contest API',
      version: '1.0.0',
      description: 'API for managing photo caption contests'
    },
     servers: [
      {
        url: "https://photo-caption-contest-api-qfel.onrender.com",
        description: 'Development server'
      }
    ],
      components: {
        securitySchemes: {
          bearerAuth: {
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT'
          }
        },
      }
  },
  apis: ['./routes/*.js'] // Path to the API routes
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = swaggerSpec;