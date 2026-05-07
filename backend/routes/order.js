const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const fetchuser = require('../middleware/fetchuser');

// ROUTE 1: Place an order: POST "/api/order/place". Login required
router.post('/place', fetchuser, async (req, res) => {
  try {
    const { items, totalAmount } = req.body;
    
    if (!items || items.length === 0) {
      return res.status(400).json({ error: 'No items in cart' });
    }

    const order = await Order.create({
      user: req.user.id,
      items,
      totalAmount
    });

    res.json({ success: true, order });
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Internal Server Error');
  }
});

// ROUTE 2: Get user orders: GET "/api/order/myorders". Login required
router.get('/myorders', fetchuser, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id }).sort({ date: -1 });
    res.json(orders);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Internal Server Error');
  }
});

module.exports = router;
