const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');


const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    match: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/,
    maxlength: 100,
  },
  password: {
    type: String,
    required: true,
    minlength: 6, 
  },
  firstName: {
    type: String,
    required: true,
    maxlength: 50, 
  },
  lastName: {
    type: String,
    required: true,
    maxlength: 50, 
  },
  phoneNumber: {
    type: String,
    required: true,
    match: /^\d{8}$/,
  },
  
  role: {
    type: String,
    enum: ['Manager', 'Admin','Customer'],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  isActivated: {
    type: Boolean,
    default: false, 
  }, 
});


userSchema.pre('save', async function (next) {
 
  if (!this.isModified('password')) return next();

  try {
 
    this.password = await bcrypt.hash(this.password, 10);
    next();
  } catch (error) {
    next(error); 
  }
});


userSchema.methods.comparePassword = async function (password) {
  try {
    
    return await bcrypt.compare(password, this.password);
  } catch (error) {
    throw new Error('Error comparing passwords');
  }
};


module.exports = mongoose.model('User', userSchema);
