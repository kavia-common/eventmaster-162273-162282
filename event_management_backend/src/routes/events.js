const express = require('express');
const auth = require('../middleware/auth');
const { createEvent, updateEvent, mongoIdParam } = require('../validation/schemas');
const { listEvents, getEvent, createEvent: createCtrl, updateEvent: updateCtrl, deleteEvent, listAttendees } = require('../controllers/events');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   - name: Events
 *     description: Event management
 */

/**
 * @swagger
 * /events:
 *   get:
 *     summary: List events
 *     tags: [Events]
 *     parameters:
 *       - in: query
 *         name: q
 *         schema: { type: string }
 *       - in: query
 *         name: my
 *         schema: { type: string, enum: [true, false] }
 *     responses:
 *       200: { description: Events list }
 */
router.get('/', listEvents);

/**
 * @swagger
 * /events/{id}:
 *   get:
 *     summary: Get event details
 *     tags: [Events]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: Event details }
 *       404: { description: Not found }
 */
router.get('/:id', mongoIdParam('id'), getEvent);

/**
 * @swagger
 * /events:
 *   post:
 *     summary: Create event
 *     tags: [Events]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201: { description: Created }
 *       400: { description: Validation error }
 *       401: { description: Unauthorized }
 */
router.post('/', auth, createEvent, createCtrl);

/**
 * @swagger
 * /events/{id}:
 *   put:
 *     summary: Update event
 *     tags: [Events]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: Updated }
 *       400: { description: Validation error }
 *       401: { description: Unauthorized }
 *       403: { description: Forbidden }
 *       404: { description: Not found }
 */
router.put('/:id', auth, mongoIdParam('id'), updateEvent, updateCtrl);

/**
 * @swagger
 * /events/{id}:
 *   delete:
 *     summary: Delete event
 *     tags: [Events]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       204: { description: Deleted }
 *       401: { description: Unauthorized }
 *       403: { description: Forbidden }
 *       404: { description: Not found }
 */
router.delete('/:id', auth, mongoIdParam('id'), deleteEvent);

/**
 * @swagger
 * /events/{id}/attendees:
 *   get:
 *     summary: List attendees for event
 *     tags: [Events]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: Attendees list }
 *       404: { description: Not found }
 */
router.get('/:id/attendees', mongoIdParam('id'), listAttendees);

module.exports = router;
