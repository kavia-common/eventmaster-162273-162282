require('dotenv').config();
const app = require('./app');
const { connectDB } = require('./config/db');

const PORT = process.env.PORT || 3001;
const HOST = process.env.HOST || '0.0.0.0';

let server;

async function start() {
  // Attempt DB connection, but don't block server startup if it fails or is not configured
  const conn = await connectDB();
  if (conn && conn.host) {
    // eslint-disable-next-line no-console
    console.log(`MongoDB connected: ${conn.host}`);
  } else {
    // eslint-disable-next-line no-console
    console.warn('MongoDB is not connected. Server will run in degraded mode.');
  }

  server = app.listen(PORT, HOST, () => {
    // eslint-disable-next-line no-console
    console.log(`Server running at http://${HOST}:${PORT}`);
  });
}

start();

// Graceful shutdown
process.on('SIGTERM', () => {
  // eslint-disable-next-line no-console
  console.log('SIGTERM signal received: closing HTTP server');
  if (server) {
    server.close(() => {
      // eslint-disable-next-line no-console
      console.log('HTTP server closed');
      process.exit(0);
    });
  } else {
    process.exit(0);
  }
});

module.exports = server;
