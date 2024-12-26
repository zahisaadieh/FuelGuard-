const mongoose = require('mongoose');


const supplierSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  createdAt: {
    type: Date,
    default: Date.now
},
});


supplierSchema.statics.findByEmail = async function (email) {
  return await this.findOne({ email });  
};


const Supplier = mongoose.model('Supplier', supplierSchema);

module.exports = Supplier;
