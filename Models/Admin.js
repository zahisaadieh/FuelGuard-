const mongoose = require('mongoose');


const AdminSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    createdAt: { type: Date, default: Date.now },
    status: { type: String, default: 'Active', enum: ['Active', 'Inactive', 'Suspended'] },
});

module.exports = mongoose.model('Admin', AdminSchema);