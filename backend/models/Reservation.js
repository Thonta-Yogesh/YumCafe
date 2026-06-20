const mongoose = require('mongoose');

const ReservationSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: false }, // Optional so non-logged-in users can book
  name: { type: String, required: true },
  phone: { type: String, required: true },
  date: { type: String, required: true },
  time: { type: String, required: true },
  guests: { type: Number, required: true },
  status: { type: String, enum: ['Confirmed', 'Cancelled'], default: 'Confirmed' },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('reservation', ReservationSchema);
