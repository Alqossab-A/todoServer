const express = require('express');
const { subTodo } = require('../models/subTodo');
const authenticate = require('../authenticate');
const cors = require('./cors');

const subTodoRouter = express.Router();

subTodoRouter
    .route('/')
    .options(cors.corsWithOptions, (req, res) => res.sendStatus(200))

    .get(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        subTodo
            .find({ userId: req.user._id })
            .then((subTodos) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(subTodos);
            })
            .catch((err) => next(err));
    })

    .post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        const newSubTodo = new subTodo({ ...req.body, userId: req.user._id });
        newSubTodo
            .save()
            .then((savedSubTodo) => {
                res.status(201).json(savedSubTodo);
            })
            .catch((err) => {
                next(err);
            });
    })

    .put(cors.corsWithOptions, authenticate.verifyUser, (req, res) => {
        res.statusCode = 403;
        res.end('PUT opration not supported on /subTodos');
    })

    .delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        subTodo
            .deleteMany({ userId: req.user._id })
            .then((response) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(response);
            })
            .catch((err) => next(err));
    });

subTodoRouter
    .route('/:subTodoId')
    .options(cors.corsWithOptions, (req, res) => res.sendStatus(200))

    .get(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        subTodo
            .findById(req.params.subTodoId)
            .then((todo) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(todo);
            })
            .catch((err) => next(err));
    })

    .post(cors.corsWithOptions, authenticate.verifyUser, (req, res) => {
        res.status = 403;
        res.end(
            `POST operation not supported on /todos/${req.params.subTodoId}`
        );
    })

    .put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        subTodo
            .findByIdAndUpdate(
                req.params.subTodoId,
                { $set: req.body },
                { new: true }
            )
            .then((SubTodo) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(subTodo);
            })
            .catch((err) => next(err));
    })

    .delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        subTodo
            .findByIdAndDelete(req.params.subTodoId)
            .then((response) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(response);
            })
            .catch((err) => next(err));
    });

module.exports = subTodoRouter;
