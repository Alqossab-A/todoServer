const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const session = require('express-session');
const FileStore = require('session-file-store')(session);

const indexRouter = require('./routes/index');
const userRouter = require('./routes/userRouter');
const todoRouter = require('./routes/todoRouter');
const subTodoRouter = require('./routes/subTodoRouter');
const extraTodoRouter = require('./routes/extraTodoRouter');

const mongoose = require('mongoose');

const url = 'mongodb://localhost:27017/todoApp';
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
//app.use(cookieParser('12345-6789-09876-54321'));

app.use(session({
    name: 'session-id',
    secret: '12345-6789-09876-54321',
    saveUninitialized: false,
    resave: false,
    store: new FileStore()
}));

function auth(req, res, next) {
    console.log(req.session);
    
    if (!req.session.user) {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            const err = new Error('Your are not authenticated!');
            res.setHeader('WWW-Authenticate', 'Basic');
            err.status = 401;
            return next(err);
        }

        const auth = Buffer.from(authHeader.split(' ')[1], 'base64')
            .toString()
            .split(':');
        const user = auth[0];
        const pass = auth[1];

        if (user === 'admin' && pass === 'password') {
            req.session.user = 'admin'
            return next(); // authorized
        } else {
            const err = new Error('You are not authenticated!');
            res.setHeader('WWW-Authenticate', 'Basic');
            err.status = 401;
            return next(err);
        }
    } else {
        if (req.session.user === 'admin') {
            return next();
        } else {
            const err = new Error('You are not authenticated!');
            err.status = 401;
            return next(err);
        }
    }
}

app.use(auth);
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', userRouter);
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
