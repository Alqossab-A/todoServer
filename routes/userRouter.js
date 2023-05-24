const express = require('express');
const User = require('../models/user');

const userRouter = express.Router();

/* GET users listing. */
userRouter.get('/', function (req, res, next) {
    res.send('respond with a resource');
});

userRouter.post('/signup', (req, res, next) => {
    User.findOne({ username: req.body.username })
    .then((user) => {
        if (user) {
            const err = new Error(
                `Username ${req.body.username} is already taken :(`
            );
            err.status = 403;
            return next(err);
        } else {
            User.create({
                username: req.body.username,
                password: req.body.password,
            })
            .then((user) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json({ status: 'Successfully Sign-Up', user: user });
            })
            .catch(err => next(err));
        }
    })
    .catch(err => next(err));
});

module.exports = userRouter;
