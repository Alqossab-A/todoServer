const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const subTodoSchema = new Schema(
    {
        subText: {
            type: String,
            required: true,
            unique: true,
        },
        done: {
            type: Booleana,
        },
    },
    {
        timestamps: true,
    }
);

const subTodo = mongoose.model('subTodo', subTodoSchema);

module.exports = subTodo;
