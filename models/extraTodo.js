const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const extraTodoSchema = new Schema(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        extraText: {
            type: String,
            required: true,
        },
        done: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    }
);

const extraTodo = mongoose.model('extraTodo', extraTodoSchema);

module.exports = { extraTodo, extraTodoSchema };
