const createError = require('http-errors');
const express = require('express');
const path = require('path');
const logger = require('morgan');
const passport = require('passport');
const config = require('./config');

const indexRouter = require('./routes/index');
const userRouter = require('./routes/userRouter');
const todoRouter = require('./routes/todoRouter');
const subTodoRouter = require('./routes/subTodoRouter');
const extraTodoRouter = require('./routes/extraTodoRouter');

const mongoose = require('mongoose');

const url = config.mongoUrl;
const connect = mongoose.connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

connect.then(
    () => console.log('Connected correctly to server'),
    (err) => console.log(err)
);

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(passport.initialize());

app.use('/', indexRouter);
app.use('/users', userRouter);

app.use(express.static(path.join(__dirname, 'public')));

app.use('/todos', todoRouter);
app.use('/subTodos', subTodoRouter);
app.use('/extraTodos', extraTodoRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // set the title variable
    res.locals.title = 'Error';

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;
