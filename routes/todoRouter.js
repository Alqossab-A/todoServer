const express = require('express');
const todoRouter = express.Router();

todoRouter
    .route('/')

    .all((req, res, next) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/plain');
        next();
    })

    .get((req, res) => {
        res.end('will send all the todos to you');
    })

    .post((req, res) => {
        res.end(
            `will add the todo: ${req.body.name} with description: ${req.body.description}`
        );
    })

    .put((req, res) => {
        res.statusCode = 403;
        res.end('PUT opration not supported on /todos');
    })

    .delete((req, res) => {
        res.end('deleteing all todos');
    });

module.exports = todoRouter;
