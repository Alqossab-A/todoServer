const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const noteSchema = new Schema(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        text: {
            type: String,
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

const Note = mongoose.model('note', noteSchema);

module.exports = { Note, noteSchema };
