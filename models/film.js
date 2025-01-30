const mongoose = require('mongoose');

// Şema tanımlama
const filmSchema = new mongoose.Schema({
  filmName: {
    type: String,
    required: true,
  },
  filmDirector: {
    type: String,
    required: true,
  },
  filmTur: {
    type: String,
    required: true,
  },
  filmIMDB: {
    type: String,
    required: true,
  },
  filmURL: {
    type: String,
    required: true,
  },
  photo: {
    type: String,
    required: false,
  },
  isActive: {
    type: Boolean,
    default: true,  // Varsayılan olarak true
  },
});

// Model tanımlama
const Film = mongoose.model('films', filmSchema);

module.exports = { Film };
