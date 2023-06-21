const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const subTodoSchema = new Schema(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
        },
        subText: {
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

const subTodo = mongoose.model('subTodo', subTodoSchema);

module.exports = { subTodo, subTodoSchema };
