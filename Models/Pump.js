const mongoose = require('mongoose');

const PumpSchema = new mongoose.Schema({
    pumpName: { type: String, required: true },
    inventoryID: { type: mongoose.Schema.Types.ObjectId, ref: 'Inventory', required: true },
});

module.exports = mongoose.model('Pump', PumpSchema);
