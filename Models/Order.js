// models/Order.js
const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    customerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Customer', 
        required: true
    },
    fuelTypeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'FuelType',
        required: true
    },
    litreOrdered: {
        type: Number,
        required: true,
        min: 0
    },
    pricePerLiter: {
        type: Number,
        required: true,
        min: 0
    },
    totalAmount: {
        type: Number,
        required: true,
        min: 0
    },
    Status: {
        type: String,
        enum: ['Released', 'Post'],
        default: 'Post'
    },
    orderDate: {
        type: Date,
        default: Date.now
    }
});

orderSchema.pre('save', function (next) {
    this.totalAmount = this.litreOrdered * this.pricePerLiter;
    next();
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
