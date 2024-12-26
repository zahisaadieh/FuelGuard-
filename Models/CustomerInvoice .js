const mongoose = require('mongoose');

const CustomerInvoiceSchema = new mongoose.Schema({
  CustomerID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Customer', 
    required: true
  },
  FuelTypeID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'FuelType', 
    required: true
  },
  OrderID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order',
    required: true
  },
  LitreOrdered: {
    type: Number,
    required: true
  },
  PricePerLiter: {
    type: Number,
    required: true
  },
  TotalAmount: {
    type: Number,
    required: true
  },
  InvoiceDate: {
    type: Date,
    default: Date.now 
  }
});

const CustomerInvoice = mongoose.model('CustomerInvoice', CustomerInvoiceSchema);

module.exports = CustomerInvoice;
