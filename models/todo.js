const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const todoSchema = new Schema(
    {
        text: {
            type: String,
            required: true,
            unique: true,
        },
        todoStatus: {
            type: String,
            default: 'todo',
        },
        completed: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    }
);

const Todo = mongoose.model('Todo', todoSchema);

module.exports = Todo;
