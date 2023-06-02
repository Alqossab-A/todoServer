const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const extraTodoSchema = new Schema(
    {
        extraText: {
            type: String,
            required: true,
            unique: true,
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
