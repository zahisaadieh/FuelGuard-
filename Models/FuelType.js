const mongoose = require('mongoose');

const fuelTypeSchema = new mongoose.Schema({
  fuelName: { type: String, required: true },
  pricePerLiter: {
    type: Number,
    default: 0,
    min: 0
},
});

module.exports = mongoose.model('FuelType', fuelTypeSchema);
