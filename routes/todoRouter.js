const express = require('express');
const { Todo } = require('../models/todo');
const authenticate = require('../authenticate');
const cors = require('./cors');

const todoRouter = express.Router();

todoRouter
    .route('/')
    .options(cors.corsWithOptions, authenticate.verifyUser, (req, res) =>
        res.sendStatus(200)
    )

    .get(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        Todo.find({ userId: req.user._id })
            .then((todos) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(todos);
            })
            .catch((err) => next(err));
    })

    .post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        const newTodo = new Todo({
            text: req.body.text,
            userId: req.user._id,
        });
        newTodo
            .save()
            .then((todo) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(todo);
            })
            .catch((err) => next(err));
    })

    .put(cors.corsWithOptions, authenticate.verifyUser, (req, res) => {
        res.statusCode = 403;
        res.end('PUT opration not supported on /todos');
    })

    .delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        Todo.deleteMany({ userId: req.user._id })
            .then((response) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(response);
            })
            .catch((err) => next(err));
    });

todoRouter
    .route('/:todoId')
    .options(cors.corsWithOptions, (req, res) => res.sendStatus(200))

    .get(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        Todo.findOne({ _id: req.params.todoId, userId: req.user._id })
            .then((todo) => {
                if (todo) {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(todo);
                } else {
                    res.statusCode = 404;
                    res.setHeader('Content-Type', 'application/json');
                    res.json({ message: 'Todo not found' });
                }
            })
            .catch((err) => next(err));
    })

    .post(cors.corsWithOptions, authenticate.verifyUser, (req, res) => {
        res.status = 403;
        res.end(`POST operation not supported on /todos/${req.params.todoId}`);
    })

    .put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        Todo.findById({ _id: req.params.todoId, userId: req.user._id })
            .then((todo) => {
                if (todo) {
                    Todo.findByIdAndUpdate(
                        { _id: req.params.todoId, userId: req.user._id },
                        { $set: req.body },
                        { new: true }
                    ).then((todo) => {
                        res.statusCode = 200;
                        res.setHeader('Content-Type', 'application/json');
                        res.json(todo);
                    });
                } else {
                    res.statusCode = 404;
                    res.setHeader('Content-Type', 'application/json');
                    res.json({ message: 'Todo does not exist' });
                }
            })
            .catch((err) => next(err));
    })

    .delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        Todo.findById({ _id: req.params.todoId, userId: req.user._id })
            .then((todo) => {
                if (todo) {
                    Todo.findByIdAndDelete({
                        _id: req.params.todoId,
                        userId: req.user._id,
                    }).then((response) => {
                        res.statusCode = 200;
                        res.setHeader('Content-Type', 'application/json');
                        res.json(response);
                    });
                } else {
                    res.statusCode = 404;
                    res.setHeader('Content-Type', 'application/json');
                    res.json({ message: 'Todo does not exist' });
                }
            })
            .catch((err) => next(err));
    });

module.exports = todoRouter;
