
const mongoose = require('mongoose');

const inventorySchema = new mongoose.Schema({
  inventoryName: { type: String, required: true },
  capacity: { type: Number, required: true },
  currentCapacity: { type: Number, required: true },
  fuelTypeID: { type: mongoose.Schema.Types.ObjectId, ref: 'FuelType', required: true },  
});

inventorySchema.methods.updateCurrentCapacity = function (soldLitres) {
  this.currentCapacity -= soldLitres;
  return this.save(); 
};

module.exports = mongoose.model('Inventory', inventorySchema);
