const mongoose = require('mongoose');
const { Schema } = mongoose;

const RSVP_SCHEMA = new Schema(
  {
    event: { type: Schema.Types.ObjectId, ref: 'Event', required: true, index: true },
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    status: { type: String, enum: ['yes', 'no', 'maybe'], required: true, default: 'yes' },
    note: { type: String, default: '' },
  },
  { timestamps: true }
);

RSVP_SCHEMA.index({ event: 1, user: 1 }, { unique: true });

module.exports = mongoose.model('RSVP', RSVP_SCHEMA);
