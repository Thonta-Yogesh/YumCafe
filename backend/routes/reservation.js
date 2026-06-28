const express = require('express');
const router = express.Router();
const Reservation = require('../models/Reservation');
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'YumCafeSuperSecretKey2026!';
const fetchuser = require('../middleware/fetchuser');

// Optional fetchuser middleware for bookings made by non-logged-in users
const fetchuserOptional = (req, res, next) => {
  const token = req.header('auth-token');
  if (token) {
    try {
      const data = jwt.verify(token, JWT_SECRET);
      req.user = data.user;
    } catch (error) {
      // invalid token, just ignore
    }
  }
  next();
};

// ROUTE 1: Place a reservation: POST "/api/reservation/book"
router.post('/book', fetchuserOptional, async (req, res) => {
  try {
    const { name, phone, date, time, guests } = req.body;
    
    if (!name || !phone || !date || !time || !guests) {
      return res.status(400).json({ error: 'Please provide all details' });
    }

    const reservation = await Reservation.create({
      user: req.user ? req.user.id : null,
      name,
      phone,
      date,
      time,
      guests
    });

    res.json({ success: true, reservation });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: error.message });
  }
});

// ROUTE 2: Get user reservations: GET "/api/reservation/myreservations". Login required
router.get('/myreservations', fetchuser, async (req, res) => {
  try {
    const reservations = await Reservation.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(reservations);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Internal Server Error');
  }
});

// ROUTE 3: Cancel a reservation: DELETE "/api/reservation/cancel/:id"
router.delete('/cancel/:id', fetchuser, async (req, res) => {
  try {
    let reservation = await Reservation.findById(req.params.id);
    if (!reservation) { return res.status(404).send("Not Found") }
    
    // Allow cancellation only if user owns it
    if (reservation.user && reservation.user.toString() !== req.user.id) {
        return res.status(401).send("Not Allowed");
    }

    reservation = await Reservation.findByIdAndDelete(req.params.id);
    res.json({ "Success": "Reservation has been cancelled", reservation: reservation });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
});

module.exports = router;
