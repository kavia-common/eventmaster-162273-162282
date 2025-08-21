const mongoose = require('mongoose');
const { Schema } = mongoose;

const EventSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    location: { type: String, default: '' },
    startTime: { type: Date, required: true },
    endTime: { type: Date, required: true },
    capacity: { type: Number, default: 0 }, // 0 means unlimited
    organizer: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    attendees: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    isPublic: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Event', EventSchema);
