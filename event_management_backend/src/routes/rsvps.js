const express = require('express');
const auth = require('../middleware/auth');
const { rsvp: rsvpRules } = require('../validation/schemas');
const { rsvp, myRsvps } = require('../controllers/rsvps');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   - name: RSVPs
 *     description: RSVP management
 */

/**
 * @swagger
 * /events/{id}/rsvp:
 *   post:
 *     summary: RSVP to event
 *     tags: [RSVPs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [status]
 *             properties:
 *               status: { type: string, enum: [yes, no, maybe] }
 *               note: { type: string }
 *     responses:
 *       200: { description: RSVP saved }
 *       401: { description: Unauthorized }
 */
router.post('/events/:id/rsvp', auth, rsvpRules, rsvp);

/**
 * @swagger
 * /rsvps/me:
 *   get:
 *     summary: My RSVPs
 *     tags: [RSVPs]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200: { description: List my RSVPs }
 *       401: { description: Unauthorized }
 */
router.get('/rsvps/me', auth, myRsvps);

module.exports = router;
