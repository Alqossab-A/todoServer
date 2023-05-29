const express = require('express');
const subTodo = require('../models/subTodo');
const authenticate = require('../authenticate');

const subTodoRouter = express.Router();

subTodoRouter
    .route('/')
    .get(authenticate.verifyUser, (req, res, next) => {
        subTodo
            .find()
            .then((subTodos) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(subTodos);
            })
            .catch((err) => next(err));
    })

    .post(authenticate.verifyUser, (req, res, next) => {
        subTodo
            .create(req.body)
            .then((SubTodo) => {
                console.log('SubTodo has been created', SubTodo);
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(SubTodo);
            })
            .catch((err) => next(err));
    })

    .put(authenticate.verifyUser, (req, res) => {
        res.statusCode = 403;
        res.end('PUT opration not supported on /subTodos');
    })

    .delete(authenticate.verifyUser, (req, res, next) => {
        subTodo
            .deleteMany()
            .then((response) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(response);
            })
            .catch((err) => next(err));
    });

subTodoRouter
    .route('/:subTodoId')
    .get(authenticate.verifyUser, (req, res, next) => {
        subTodo
            .findById(req.params.subTodoId)
            .then((todo) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(todo);
            })
            .catch((err) => next(err));
    })

    .post(authenticate.verifyUser, (req, res) => {
        res.status = 403;
        res.end(
            `POST operation not supported on /todos/${req.params.subTodoId}`
        );
    })

    .put(authenticate.verifyUser, (req, res, next) => {
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

    .delete(authenticate.verifyUser, (req, res, next) => {
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
