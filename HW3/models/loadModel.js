const mongoose = require('mongoose');
const user = require('./userModel');

const { LOAD_STATE, LOAD_STATUS } = require('../utils/constants');

const loadSchema = new mongoose.Schema({
    _id: mongoose.Types.ObjectId,
    created_by: {
        type: mongoose.Types.ObjectId,
        ref: user,
        required: true,
    },
    assigned_to: {
        type: mongoose.Types.ObjectId,
        ref: user,
        required: false,
    },
    status: {
        type: String,
        enum: Object.values(LOAD_STATUS),
    },
    state: {
        type: String,
        enum: LOAD_STATE,
    },
    name: {
        type: String,
        required: true,
    },
    payload: {
        type: Number,
        required: true,
    },
    pickup_address: {
        type: String,
        required: true,
    },
    delivery_address: {
    type: String,
    required: true,
    },
    dimensions: {
        width: {
          type: Number,
          required: true,
        },
        length: {
          type: Number,
          required: true,
        },
        height: {
          type: Number,
          required: true,
        },
    },
    logs: [
        {
            message: {
                type: String,
                required: false,
            },
            time: {
                type: Date,
                required: false,
            },
        },
    ],
    created_date: {
        type: Date,
        required: true,
    },
});

module.exports = mongoose.model('Load', loadSchema);
