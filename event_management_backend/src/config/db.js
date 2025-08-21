const mongoose = require('mongoose');

/**
 * Connect to MongoDB using environment variables:
 * - MONGODB_URL: full connection string (without db name)
 * - MONGODB_DB: database name
 *
 * Behavior:
 * - If env vars are missing, log a warning and return null (app can still start).
 * - If connection fails, log error and return null (app can still start).
 */
async function connectDB() {
  const baseUrl = process.env.MONGODB_URL;
  const dbName = process.env.MONGODB_DB;

  if (!baseUrl || !dbName) {
    // eslint-disable-next-line no-console
    console.warn('MongoDB not configured: Missing MONGODB_URL or MONGODB_DB. Starting server without DB connection.');
    return null;
  }

  try {
    // If the URL already contains a db, Mongoose will use that.
    // To enforce a db name, append it if not present.
    const hasDbInUrl = /\/[^/?]+(\?|$)/.test(baseUrl);
    const connectionString = hasDbInUrl ? baseUrl : `${baseUrl.replace(/\/+$/, '')}/${dbName}`;

    mongoose.set('strictQuery', false);

    await mongoose.connect(connectionString, {
      // modern mongoose no need for useNewUrlParser/useUnifiedTopology
      dbName: dbName, // ensures DB selection even if URL had admin
    });

    return mongoose.connection;
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('MongoDB connection failed:', err.message);
    return null;
  }
}

module.exports = { connectDB };
