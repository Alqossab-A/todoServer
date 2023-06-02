const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');
const { todoSchema } = require('./todo');
const { subTodoSchema } = require('./subTodo');
const { extraTodoSchema } = require('./extraTodo');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    admin: {
        type: Boolean,
        default: false,
        required: true
    },
    todo: [todoSchema],
    subTodo: [subTodoSchema],
    extraTodo: [extraTodoSchema],
});

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', userSchema);