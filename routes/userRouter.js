const express = require('express');
const User = require('../models/user');
const passport = require('passport');
const authenticate = require('../authenticate');
const cors = require('./cors');
const config = require('../config');

const userRouter = express.Router();

/* GET users listing. */
userRouter.get(
    '/',
    cors.corsWithOptions,
    authenticate.verifyUser,
    authenticate.verifyAdmin,
    (req, res, next) => {
        User.find()
            .then((users) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(users);
            })
            .catch((err) => next(err));
    }
);

userRouter.post('/signup', cors.corsWithOptions, (req, res) => {
    User.register(
        new User({ username: req.body.username }),
        req.body.password,
        (err) => {
            if (err) {
                res.statusCode = 500;
                res.setHeader('Content-Type', 'application/json');
                res.json({ err: err });
            } else {
                passport.authenticate('local')(req, res, () => {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json({
                        success: true,
                        status: 'Registration Complete! :)',
                    });
                });
            }
        }
    );
});

userRouter.post(
    '/login',
    cors.corsWithOptions,
    passport.authenticate('local', { session: false }),
    (req, res) => {
        const token = authenticate.getToken({ _id: req.user._id });

        res.cookie('jwt', token, {
            httpOnly: true,
            sameSite: 'None',
            secure: true,
        });
        res.cookie('logged_in', true, {
            sameSite: 'None',
            secure: true,
        });
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json({
            success: true,
            status: 'Logged in :o',
            username: req.user.username,
        });
    }
);

userRouter.get('/checkLogin', cors.corsWithOptions, (req, res) => {
    if (req.cookies.logged_in && req.cookies.jwt) {
        const token = req.cookies.jwt;
        const result = authenticate.verifyToken(token, config.secretKey);

        if (result.success) {
            User.findById(result.decoded._id)
                .then((user) => {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json({
                        success: true,
                        status: 'Logged in :o',
                        username: user.username,
                    });
                })
                .catch((err) => {
                    res.statusCode = 501;
                    res.setHeader('Content-Type', 'application/json');
                    res.json({ err: err });
                });
        } else if (result.error === 'Token expired') {
            res.statusCode = 402;
            res.setHeader('Content-Type', 'application/json');
            res.json({
                success: false,
                status: 'Token expired',
            });
        } else {
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            res.json({ err: result.error });
        }
    } else {
        res.statusCode = 401;
        res.setHeader('Content-Type', 'application/json');
        res.json({
            success: false,
            status: 'Not logged in',
        });
    }
});

userRouter.get('/logout', cors.corsWithOptions, (req, res) => {
    res.cookie('jwt', '', {
        expires: new Date(0),
        httpOnly: true,
        secure: true,
        sameSite: 'None',
    });
    res.cookie('logged_in', '', {
        expires: new Date(0),
        sameSite: 'None',
        secure: true,
    });
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json({
        success: true,
        status: 'Logged out',
    });
});

module.exports = userRouter;
