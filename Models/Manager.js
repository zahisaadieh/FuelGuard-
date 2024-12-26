const mongoose = require('mongoose');


const ManagerSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    createdAt: { type: Date, default: Date.now },
    status: { type: String, default: 'Active', enum: ['Active', 'Inactive', 'Suspended'] },
});

module.exports = mongoose.model('Manager', ManagerSchema);
