const mongoose = require('mongoose');

// Şema tanımlama
const registerSchema = new mongoose.Schema({
  userName: {
    type: String,
    required: true,
  },
  userFirstName: {
    type: String,
    required: true,
  },
  userSurname: {
    type: String,
    required: true,
  },
  userMail: {
    type: String,
    required: true,
  },
  isActive: {
    type: Boolean,
    default: true,  // Varsayılan olarak true
  },

  userPassword: {
    type: String,
    required: true,
  },
  
  favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Film' }] 
});

// Model tanımlama
const Register = mongoose.model('registers', registerSchema);

module.exports = {Register};
