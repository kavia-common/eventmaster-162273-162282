const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// PUBLIC_INTERFACE
async function register(req, res) {
  /** Register a new user.
   * Body: { name, email, password }
   * Returns: { user, token }
   */
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const { name, email, password } = req.body;
  const exists = await User.findOne({ email });
  if (exists) return res.status(409).json({ message: 'Email already registered' });

  const passwordHash = await User.hashPassword(password);
  const user = await User.create({ name, email, passwordHash });
  const token = signToken(user._id);
  return res.status(201).json({ user, token });
}

// PUBLIC_INTERFACE
async function login(req, res) {
  /** Login with email/password. Returns { user, token } */
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(401).json({ message: 'Invalid credentials' });

  const ok = await user.comparePassword(password);
  if (!ok) return res.status(401).json({ message: 'Invalid credentials' });

  const token = signToken(user._id);
  return res.json({ user, token });
}

// PUBLIC_INTERFACE
async function me(req, res) {
  /** Get current authenticated user */
  return res.json({ user: req.user });
}

function signToken(userId) {
  const secret = process.env.JWT_SECRET;
  const expiresIn = process.env.JWT_EXPIRES_IN || '7d';
  return jwt.sign({ sub: userId.toString() }, secret, { expiresIn });
}

module.exports = { register, login, me };
