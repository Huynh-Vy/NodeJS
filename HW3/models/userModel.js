const mongoose = require('mongoose');
const { ROLE } = require('../utils/constants');

const userSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        minlength: 6,
        required: true,
    },
    role: {
        type: String,
        required: true,
        enum: Object.values(ROLE),
    },
    resetLink: {
        data: String,
        default: '',
    },
    created_date: {
        type: Date,
        default: Date.now(),
    },
},
    { collection: 'users' },
);

module.exports = mongoose.model('User', userSchema);
