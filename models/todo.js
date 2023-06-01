const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const todoSchema = new Schema(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
        },
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

module.exports = { Todo, todoSchema };

