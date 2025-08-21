const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const path = require('path');
const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Auth API',
      version: process.env.API_VERSION || '1.0.0',
      description: 'API para autenticación.\n\n**Novedades v2.0.0:**\n- Validaciones robustas en todos los endpoints\n- Documentación Swagger mejorada',
      contact: {
        name: 'Andres Olarte',
        url: 'https://github.com/andres-olarte396',
      },
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT',
      },
    },
    servers: [
      {
        url: `http://localhost:${process.env.LOCAL_PORT || 3000}`,
        description: 'Servidor local',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        User: {
          type: 'object',
          required: ['username', 'password'],
          properties: {
            username: {
              type: 'string',
              example: 'usuario1',
            },
            password: {
              type: 'string',
              example: 'password123',
            }
          },
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: [path.join(__dirname, '../routes/*.js')], // Ruta correcta a los archivos de rutas
};

const swaggerSpec = swaggerJsDoc(options);

const swaggerDocs = (app) => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  console.log(`Documentación Swagger disponible en http://localhost:${process.env.LOCAL_PORT || 4000}/api-docs`);
};

module.exports = swaggerDocs;
