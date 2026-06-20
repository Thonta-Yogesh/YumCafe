const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
  items: [
    {
      foodId: { type: String, required: false },
      name: { type: String, required: true },
      price: { type: Number, required: true },
      quantity: { type: Number, required: true },
    }
  ],
  totalAmount: { type: Number, required: true },
  subTotal: { type: Number },
  discount: { type: Number },
  tax: { type: Number },
  deliveryFee: { type: Number },
  orderType: { type: String, enum: ['Delivery', 'Table'], default: 'Delivery' },
  address: { type: String },
  tableNo: { type: String },
  date: { type: Date, default: Date.now },
});

module.exports = mongoose.model('order', OrderSchema);
