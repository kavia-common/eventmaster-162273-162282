const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * Express middleware to authenticate requests using Bearer JWT.
 * Adds req.user on success.
 */
async function auth(req, res, next) {
  try {
    const header = req.headers.authorization || '';
    const [, token] = header.split(' ');
    if (!token) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.sub);
    if (!user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    req.user = user;
    next();
  } catch (e) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
}

module.exports = auth;
