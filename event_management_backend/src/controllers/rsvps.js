const { validationResult } = require('express-validator');
const Event = require('../models/Event');
const RSVP = require('../models/RSVP');

// PUBLIC_INTERFACE
async function rsvp(req, res) {
  /** RSVP to an event: status yes/no/maybe, maintain attendees on event */
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const { status, note } = req.body;
  const eventId = req.params.id;

  const ev = await Event.findById(eventId);
  if (!ev) return res.status(404).json({ message: 'Event not found' });

  const upsert = await RSVP.findOneAndUpdate(
    { event: ev._id, user: req.user._id },
    { status, note },
    { new: true, upsert: true, setDefaultsOnInsert: true }
  );

  // Maintain attendee list for 'yes'
  const isYes = status === 'yes';
  const idx = ev.attendees.findIndex((u) => u.toString() === req.user._id.toString());
  if (isYes && idx === -1) {
    // capacity check
    if (ev.capacity > 0 && ev.attendees.length >= ev.capacity) {
      return res.status(409).json({ message: 'Event is at full capacity' });
    }
    ev.attendees.push(req.user._id);
    await ev.save();
  } else if (!isYes && idx !== -1) {
    ev.attendees.splice(idx, 1);
    await ev.save();
  }

  return res.json({ rsvp: upsert });
}

// PUBLIC_INTERFACE
async function myRsvps(req, res) {
  /** List RSVPs for the authenticated user */
  const items = await RSVP.find({ user: req.user._id }).populate({
    path: 'event',
    populate: { path: 'organizer', select: 'name email' },
  });
  return res.json({ items });
}

module.exports = { rsvp, myRsvps };
