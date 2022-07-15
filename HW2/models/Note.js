const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const noteSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
    },
    text: {
        type: String,
        trim: true,
        required: true,
    },
    date: {
        type: Date,
        default: Date.now,
    },
    completed: {
        type: Boolean,
        required: true,
    },
});

noteSchema.plugin(mongoosePaginate);
module.exports = mongoose.model('Note', noteSchema);
