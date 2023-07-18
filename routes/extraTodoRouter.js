const express = require('express');
const { extraTodo } = require('../models/extraTodo');
const authenticate = require('../authenticate');
const cors = require('./cors');

const extraTodoRouter = express.Router();

extraTodoRouter
    .route('/')
    .options(cors.corsWithOptions, authenticate.verifyUser, (req, res) =>
        res.sendStatus(200)
    )

    .get(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        extraTodo
            .find({ userId: req.user._id })
            .then((extraTodos) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(extraTodos);
            })
            .catch((err) => next(err));
    })

    .post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        const newExtraTodo = new extraTodo({
            ...req.body,
            userId: req.user._id,
        });
        newExtraTodo
            .save()
            .then((savedExtraTodo) => {
                res.status(201).json(savedExtraTodo);
            })
            .catch((err) => {
                next(err);
            });
    })

    .put(cors.corsWithOptions, authenticate.verifyUser, (req, res) => {
        res.statusCode = 403;
        res.end('PUT opration not supported on /extraTodos');
    })

    .delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        res.statusCode = 403;
        res.end('DELETE opration not supported on /extraTodos');
    });

extraTodoRouter
    .route('/:extraTodoId')
    .options(cors.corsWithOptions, authenticate.verifyUser, (req, res) =>
        res.sendStatus(200)
    )

    .get(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        extraTodo
            .findOne({ _id: req.params.extraTodoId, userId: req.user._id })
            .then((extraTodo) => {
                if (extraTodo) {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(extraTodo);
                } else {
                    res.statusCode = 404;
                    res.setHeader('Content-Type', 'application/json');
                    res.json({
                        message: 'ExtraTodo does not exist',
                    });
                }
            })
            .catch((err) => next(err));
    })

    .post(cors.corsWithOptions, authenticate.verifyUser, (req, res) => {
        res.status = 403;
        res.end(
            `POST operation not supported on /extraTodos/${req.params.extraTodoId}`
        );
    })

    .put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        extraTodo
            .findById({ _id: req.params.extraTodoId, userId: req.user._id })
            .then((extratodo) => {
                if (extratodo) {
                    extraTodo
                        .findByIdAndUpdate(
                            {
                                _id: req.params.extraTodoId,
                                userId: req.user._id,
                            },
                            { $set: req.body },
                            { new: true }
                        )
                        .then((extraTodo) => {
                            res.statusCode = 200;
                            res.setHeader('Content-Type', 'application/json');
                            res.json(extraTodo);
                        });
                } else {
                    res.statusCode = 404;
                    res.setHeader('Content-Type', 'application/json');
                    res.json({ message: 'Extratodo does not exist' });
                }
            })
            .catch((err) => next(err));
    })

    .delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        extraTodo
            .findById({ _id: req.params.extraTodoId, userId: req.user._id })
            .then((extratodo) => {
                if (extratodo) {
                    extraTodo
                        .findByIdAndDelete({
                            _id: req.params.extraTodoId,
                            userId: req.user._id,
                        })
                        .then((response) => {
                            res.statusCode = 200;
                            res.setHeader('Content-Type', 'application/json');
                            res.json(response);
                        });
                } else {
                    res.statusCode = 404;
                    res.setHeader('Content-Type', 'application/json');
                    res.json({ message: 'Extratodo does not exist' });
                }
            })
            .catch((err) => next(err));
    });

module.exports = extraTodoRouter;
