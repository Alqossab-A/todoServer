const express = require('express');
const extraTodo = require('../models/extraTodo');

const extraTodoRouter = express.Router();

extraTodoRouter
    .route('/')
    .get((req, res, next) => {
        extraTodo
            .find()
            .then((extraTodos) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(extraTodos);
            })
            .catch((err) => next(err));
    })

    .post((req, res, next) => {
        extraTodo
            .create(req.body)
            .then((extraTodo) => {
                console.log('extraTodo has been created', extraTodo);
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(extraTodo);
            })
            .catch((err) => next(err));
    })

    .put((req, res) => {
        res.statusCode = 403;
        res.end('PUT opration not supported on /extraTodos');
    })

    .delete((req, res, next) => {
        extraTodo
            .deleteMany()
            .then((response) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(response);
            })
            .catch((err) => next(err));
    });

extraTodoRouter
    .route('/:extraTodoId')
    .get((req, res, next) => {
        extraTodo
            .findById(req.params.extraTodoId)
            .then((todo) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(todo);
            })
            .catch((err) => next(err));
    })

    .post((req, res) => {
        res.status = 403;
        res.end(
            `POST operation not supported on /todos/${req.params.extraTodoId}`
        );
    })

    .put((req, res, next) => {
        extraTodo
            .findByIdAndUpdate(
                req.params.extraTodoId,
                { $set: req.body },
                { new: true }
            )
            .then((extraTodo) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(extraTodo);
            })
            .catch((err) => next(err));
    })

    .delete((req, res, next) => {
        extraTodo
            .findByIdAndDelete(req.params.extraTodoId)
            .then((response) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(response);
            })
            .catch((err) => next(err));
    });

module.exports = extraTodoRouter;
