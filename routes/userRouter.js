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
                        res.json({
                            status: 'Successfully Sign-Up',
                            user: user,
                        });
                    })
                    .catch((err) => next(err));
            }
        })
        .catch((err) => next(err));
});

userRouter.post('/login', (req, res, next) => {
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
        const username = auth[0];
        const password = auth[1];

        User.findOne({ username: username })
            .then((user) => {
                if (!user) {
                    const err = new Error(`User ${username} doesnt exist :/`);
                    err.status = 401;
                    return next(err);
                } else if (user.password !== password) {
                    const err = new Error(`Incorrect password :/`);
                    err.status = 401;
                    return next(err);
                } else if (
                    user.username === username &&
                    user.password === password
                ) {
                    req.session.user = 'authenticated';
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'text/plain');
                    res.end('You have Logged-In :)');
                }
            })
            .catch((err) => next(err));
    } else {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/plain');
        res.end('You are already logged in :)');
    }
});

userRouter.get('/logout', (req, res, next) => {
    if (req.session) {
        req.session.destroy((err) => {
            if (err) {
                console.error(err);
            } else {
                res.clearCookie('session-id');
                res.redirect('/');
            }
        });
    } else {
        const err = new Error('You are not Logged in! sussy');
        err.status = 401;
        return next(err);
    }
});

module.exports = userRouter;
