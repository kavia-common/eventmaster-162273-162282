const express = require('express');
const { authRegister, authLogin } = require('../validation/schemas');
const { register, login, me } = require('../controllers/auth');
const auth = require('../middleware/auth');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   - name: Auth
 *     description: User authentication
 */

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, email, password]
 *             properties:
 *               name: { type: string }
 *               email: { type: string, format: email }
 *               password: { type: string, minLength: 6 }
 *     responses:
 *       201: { description: User created }
 *       409: { description: Email already registered }
 */
router.post('/register', authRegister, register);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email: { type: string, format: email }
 *               password: { type: string }
 *     responses:
 *       200: { description: Login success }
 *       401: { description: Invalid credentials }
 */
router.post('/login', authLogin, login);

/**
 * @swagger
 * /auth/me:
 *   get:
 *     summary: Current user
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200: { description: Current user }
 *       401: { description: Unauthorized }
 */
router.get('/me', auth, me);

module.exports = router;
