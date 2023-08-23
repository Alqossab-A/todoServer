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
    const loggedInCookie = req.cookies.logged_in;
    const jwtCookie = req.cookies.jwt;

    if (loggedInCookie && jwtCookie) {
        const token = jwtCookie;
        const verificationResult = authenticate.verifyToken(
            token,
            config.secretKey
        );

        if (verificationResult.success) {
            User.findById(verificationResult.decoded._id)
                .then((user) => {
                    res.status(200).json({
                        success: true,
                        message: 'Logged in',
                        username: user.username,
                    });
                })
                .catch((err) => {
                    res.status(500).json({
                        success: false,
                        error: err.message,
                    });
                });
        } else if (verificationResult.error === 'Token expired') {
            res.status(401).json({
                success: false,
                message: 'Token expired',
            });
        } else {
            res.status(500).json({
                success: false,
                error: verificationResult.error,
            });
        }
    } else {
        res.status(401).json({
            success: false,
            message: 'Not logged in',
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
