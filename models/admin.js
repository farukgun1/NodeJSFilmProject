const mongoose = require('mongoose')
const admin = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  surname: {
    type: String,
    required: true,
  },
 
  isActive: {
    type: Boolean,
    required: false,
    default:true
  },
  createdAt: {
    type: Number,
    required: false,
  },
  updatedAt: {
    type: Number,
    required: false,
  },
  actions: {
    type: Array,
    default: [],
  },
})

const adminSchema = mongoose.model('admins', admin)

module.exports = { adminSchema }
