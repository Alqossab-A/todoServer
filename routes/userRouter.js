const express = require('express');
const User = require('../models/user');
const passport = require('passport');
const authenticate = require('../authenticate');
const cors = require('./cors');

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
        // Generate JWT token
        const token = authenticate.getToken({ _id: req.user._id });

        // Set JWT token in an HttpOnly cookie
        res.cookie('jwt', token, {
            httpOnly: true,
            sameSite: 'None',
            secure: true // Set to true if using HTTPS
        });

        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json({
            success: true,
            status: 'Logged in :o',
        });
    }
);

userRouter.get('/logout', cors.corsWithOptions, (req, res, next) => {
    if (req.session) {
        req.session.destroy((err) => {
            if (err) {
                console.error(err);
            } else {
                res.clearCookie('jwt');
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
