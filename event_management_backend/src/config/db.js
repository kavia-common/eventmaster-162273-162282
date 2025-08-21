const mongoose = require('mongoose');

/**
 * Connect to MongoDB using environment variables:
 * - MONGODB_URL: full connection string (without db name)
 * - MONGODB_DB: database name
 */
async function connectDB() {
  const baseUrl = process.env.MONGODB_URL;
  const dbName = process.env.MONGODB_DB;

  if (!baseUrl || !dbName) {
    throw new Error('Missing required environment variables MONGODB_URL or MONGODB_DB');
  }

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
}

module.exports = { connectDB };
