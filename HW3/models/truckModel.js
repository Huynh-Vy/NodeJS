const mongoose = require('mongoose');
const { TYPE, STATUS } = require('../utils/constants');

const truckSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  created_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
  assigned_to: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: false,
  },
  type: {
    type: String,
    required: true,
    enum: Object.values(TYPE),
  },
  status: {
    type: String,
    required: true,
    enum: Object.values(STATUS),
  },
  created_date: {
    type: Date,
    required: true,
  },
},
);

module.exports = mongoose.model('Truck', truckSchema);
