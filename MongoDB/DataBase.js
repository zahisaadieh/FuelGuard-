/* 
const mongoose = require('mongoose');




const pumpSchema = new mongoose.Schema({
  pumpName: { type: String, required: true },
  inventoryID: mongoose.Types.ObjectId,
});


const pumpTransactionSchema = new mongoose.Schema({
  pumpID: mongoose.Types.ObjectId,
  currentCounter: { type: Number, required: true },
  pricePerLiter: { type: Number, required: true },
  soldLitre: { type: Number, required: true },
  date: { type: Date, required: true },
});


const dailyAccountSchema = new mongoose.Schema({
  date: { type: Date, required: true },
  inventoryID: mongoose.Types.ObjectId,
  soldLitre: Number,
  dep: Number,
  repay: Number,
});


const pendingBillSchema = new mongoose.Schema({
  customerID: mongoose.Types.ObjectId,
  fuelTypeID: mongoose.Types.ObjectId,
  litreRequest: Number,
  pricePerLitre: Number,
  date: { type: Date, required: true },
  serialOfQRCode: String,
  status: { type: String, enum: ['Pending', 'Done'], default: 'Pending' },
});


const billSchema = new mongoose.Schema({
  customerID: mongoose.Types.ObjectId,
  litreDispensed: Number,
  date: { type: Date, required: true },
  totalBill: { type: Number, required: true, default: 0.00 },
  amountPaid: { type: Number, required: true, default: 0.00 },
  remaining: { type: Number, default: function () { return this.totalBill - this.amountPaid; } },
  status: { type: String, enum: ['Paid', 'Not Paid'], default: 'Not Paid' },
});


const paidBillSchema = new mongoose.Schema({
  billID: mongoose.Types.ObjectId,
  customerID: mongoose.Types.ObjectId,
  litreDispensed: Number,
  date: { type: Date, required: true },
  paidAt: { type: Date, default: Date.now },
});


const User = mongoose.model('User', userSchema);
const Shift = mongoose.model('Shift', shiftSchema);
const Employee = mongoose.model('Employee', employeeSchema);
const Supplier = mongoose.model('Supplier', supplierSchema);
const Invoice = mongoose.model('Invoice', invoiceSchema);
const FuelDelivery = mongoose.model('FuelDelivery', fuelDeliverySchema);
const Pump = mongoose.model('Pump', pumpSchema);
const PumpTransaction = mongoose.model('PumpTransaction', pumpTransactionSchema);
const DailyAccount = mongoose.model('DailyAccount', dailyAccountSchema);
const PendingBill = mongoose.model('PendingBill', pendingBillSchema);
const Bill = mongoose.model('Bill', billSchema);
const PaidBill = mongoose.model('PaidBill', paidBillSchema);


module.exports = {
  User,
  Shift,
  Employee,
  Supplier,
  Invoice,
  FuelDelivery,
  Pump,
  PumpTransaction,
  DailyAccount,
  PendingBill,
  Bill,
  PaidBill,
};
 */