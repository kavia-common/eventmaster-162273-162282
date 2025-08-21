const { validationResult } = require('express-validator');
const Event = require('../models/Event');
const RSVP = require('../models/RSVP');

// PUBLIC_INTERFACE
async function listEvents(req, res) {
  /** List events (public or owned) with basic filters */
  const { q, my } = req.query;
  const filter = {};
  if (q) {
    filter.title = { $regex: q, $options: 'i' };
  }
  if (my === 'true' && req.user) {
    filter.organizer = req.user._id;
  } else {
    filter.isPublic = true;
  }
  const items = await Event.find(filter).sort({ startTime: 1 }).populate('organizer', 'name email');
  return res.json({ items });
}

// PUBLIC_INTERFACE
async function getEvent(req, res) {
  /** Get event details by id */
  const ev = await Event.findById(req.params.id).populate('organizer', 'name email').populate('attendees', 'name email');
  if (!ev) return res.status(404).json({ message: 'Event not found' });
  return res.json({ event: ev });
}

// PUBLIC_INTERFACE
async function createEvent(req, res) {
  /** Create a new event as organizer */
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const payload = {
    title: req.body.title,
    description: req.body.description,
    location: req.body.location,
    startTime: req.body.startTime,
    endTime: req.body.endTime,
    capacity: req.body.capacity ?? 0,
    isPublic: req.body.isPublic ?? true,
    organizer: req.user._id,
  };
  const created = await Event.create(payload);
  return res.status(201).json({ event: created });
}

// PUBLIC_INTERFACE
async function updateEvent(req, res) {
  /** Update an event, only organizer can update */
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const ev = await Event.findById(req.params.id);
  if (!ev) return res.status(404).json({ message: 'Event not found' });
  if (ev.organizer.toString() !== req.user._id.toString()) {
    return res.status(403).json({ message: 'Forbidden' });
  }

  ['title', 'description', 'location', 'startTime', 'endTime', 'capacity', 'isPublic'].forEach((k) => {
    if (req.body[k] !== undefined) ev[k] = req.body[k];
  });
  await ev.save();
  return res.json({ event: ev });
}

// PUBLIC_INTERFACE
async function deleteEvent(req, res) {
  /** Delete an event, organizer only */
  const ev = await Event.findById(req.params.id);
  if (!ev) return res.status(404).json({ message: 'Event not found' });
  if (ev.organizer.toString() !== req.user._id.toString()) {
    return res.status(403).json({ message: 'Forbidden' });
  }
  await RSVP.deleteMany({ event: ev._id });
  await ev.deleteOne();
  return res.status(204).send();
}

// PUBLIC_INTERFACE
async function listAttendees(req, res) {
  /** List attendees for an event */
  const ev = await Event.findById(req.params.id).populate('attendees', 'name email');
  if (!ev) return res.status(404).json({ message: 'Event not found' });
  return res.json({ attendees: ev.attendees });
}

module.exports = {
  listEvents,
  getEvent,
  createEvent,
  updateEvent,
  deleteEvent,
  listAttendees,
};
