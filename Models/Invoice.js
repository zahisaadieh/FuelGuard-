const mongoose = require('mongoose');
const { Schema } = mongoose;
const invoiceSchema = new Schema({
  supplierID: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'Supplier',
  },
  totalAmount: {
    type: Number,
    required: true,
  },
  payments: [
    {
      amount: { type: Number, required: true },
      paymentDate: { type: Date, default: Date.now },
    },
  ],
  amountPaid: { 
    type: Number,
    default: 0,
  },
  remainingAmount: { 
    type: Number,
    default: function () {
      return this.totalAmount; 
    },
  },
  paymentStatus: {
    type: String,
    enum: ['Paid', 'Unpaid'],
    default: 'Unpaid',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  invoiceName: {
    type: String,
  },
});

invoiceSchema.pre('save', function (next) {
  this.amountPaid = this.payments.reduce((sum, payment) => sum + payment.amount, 0);
  this.remainingAmount = this.totalAmount - this.amountPaid;

  this.paymentStatus = this.remainingAmount > 0 ? 'Unpaid' : 'Paid';

  next();
});

module.exports = mongoose.model('Invoice', invoiceSchema);
