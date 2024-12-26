const mongoose = require('mongoose');

const pumpTransactionSchema = new mongoose.Schema({
  pumpId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Pump',
    required: true
  },
  orderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order',
    default: null,
  },
  oldCounter: {
    type: Number,
    default: 0
  },
  currentCounter: {
    type: Number,
    default: 0
  },
  pricePerLiter: {
    type: Number,
    required: true
  },
  soldLitre: {
    type: Number,
    required: true
  },
  transactionDate: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('PumpTransaction', pumpTransactionSchema);
