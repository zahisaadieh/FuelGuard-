// models/Customer.js
const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', 
        required: true
    },
    creditLimit: {
        type: Number,
        required: true,
        min: 0
    },
    remainingLimit: {
        type: Number,
        required: true,
        min: 0
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    status: {
        type: String,
        default: 'Active',
        enum: ['Active', 'Inactive', 'Suspended']
    }
});

customerSchema.pre('save', function (next) {
    console.log('Middleware Triggered - isNew:', this.isNew);
    if (this.isNew) {
        this.remainingLimit = this.creditLimit;
        console.log('Setting remainingLimit to:', this.creditLimit);
    }
    next();
});


const Customer = mongoose.model('Customer', customerSchema);

module.exports = Customer;
