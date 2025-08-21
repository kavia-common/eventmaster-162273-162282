const swaggerJSDoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Event Management API',
      version: '1.0.0',
      description: 'Express API for users, events, RSVPs, and attendee management',
    },
    tags: [
      { name: 'Health', description: 'Service health' },
      { name: 'Auth', description: 'User authentication' },
      { name: 'Events', description: 'Event CRUD and details' },
      { name: 'RSVPs', description: 'RSVP operations' },
    ]
  },
  apis: ['./src/routes/*.js'], // Path to the API docs
};

const swaggerSpec = swaggerJSDoc(options);
module.exports = swaggerSpec;
