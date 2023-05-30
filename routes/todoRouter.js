const express = require('express');
const Todo = require('../models/todo');
const authenticate = require('../authenticate');

const todoRouter = express.Router();

todoRouter
    .route('/')
    .get(authenticate.verifyUser, (req, res, next) => {
        Todo.find()
            .then((todos) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(todos);
            })
            .catch((err) => next(err));
    })

    .post(authenticate.verifyUser, (req, res, next) => {
        Todo.create(req.body)
            .then((todo) => {
                console.log('Todo created', todo);
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(todo);
            })
            .catch((err) => next(err));
    })

    .put(authenticate.verifyUser, (req, res) => {
        res.statusCode = 403;
        res.end('PUT opration not supported on /todos');
    })

    .delete(authenticate.verifyUser, (req, res, next) => {
        Todo.deleteMany()
            .then((response) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(response);
            })
            .catch((err) => next(err));
    });

todoRouter
    .route('/:todoId')
    .get(authenticate.verifyUser, (req, res, next) => {
        Todo.findById(req.params.todoId)
            .then((todo) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(todo);
            })
            .catch((err) => next(err));
    })

    .post(authenticate.verifyUser, (req, res) => {
        res.status = 403;
        res.end(`POST operation not supported on /todos/${req.params.todoId}`);
    })

    .put(authenticate.verifyUser, (req, res, next) => {
        Todo.findByIdAndUpdate(
            req.params.todoId,
            { $set: req.body },
            { new: true }
        )
            .then((todo) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(todo);
            })
            .catch((err) => next(err));
    })

    .delete(authenticate.verifyUser, (req, res, next) => {
        Todo.findByIdAndDelete(req.params.todoId)
            .then((response) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(response);
            })
            .catch((err) => next(err));
    });

module.exports = todoRouter;
