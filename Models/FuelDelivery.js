const mongoose = require('mongoose');

const fuelDeliverySchema = new mongoose.Schema(
  {
    supplierID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Supplier',
      required: true,
    },
    inventoryID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Inventory',
      required: true,
    },
    invoiceID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Invoice',
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 0,
    },
    pricePerLiter: {
      type: Number,
      required: true,
      min: 0,
    },
    deliveryDate: {
      type: Date,
      required: true,
      default: Date.now,
    },
    totalPrice: {
      type: Number,
      default: function () {
        return this.quantity * this.pricePerLiter;
      },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('FuelDelivery', fuelDeliverySchema);
