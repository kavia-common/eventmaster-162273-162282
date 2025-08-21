const mongoose = require('mongoose');

class HealthService {
  getStatus() {
    // Map mongoose connection states for easier reading
    // 0: disconnected, 1: connected, 2: connecting, 3: disconnecting
    const state = mongoose.connection?.readyState;
    let dbStatus = 'unknown';
    if (state === 1) dbStatus = 'connected';
    else if (state === 2) dbStatus = 'connecting';
    else if (state === 0) dbStatus = process.env.MONGODB_URL && process.env.MONGODB_DB ? 'disconnected' : 'not_configured';
    else if (state === 3) dbStatus = 'disconnecting';

    return {
      status: 'ok',
      message: 'Service is healthy',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development',
      database: {
        status: dbStatus,
      },
    };
  }
}

module.exports = new HealthService();
