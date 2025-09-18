import swaggerJSDoc from 'swagger-jsdoc';
import { SERVER_URL } from './env.js';


const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Subsman API',
      version: '1.0.0',
      description: 'API documentation for Subsman'
    },
    servers: [
      { url: SERVER_URL }
    ],
  },
  apis: ['./routes/*.routes.js', './controllers/*.controller.js'] // paths where you will add JSDoc comments
};

const swaggerSpec = swaggerJSDoc(options);

export default swaggerSpec;