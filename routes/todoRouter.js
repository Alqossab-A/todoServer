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

todoRouter
    .route('/:todoId')
    .all((req, res, next) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/plain');
        next();
    })

    .get((req, res) => {
        res.end(`Will send details of the todo: ${req.params.todoId} to you`);
    })

    .post((req, res) => {
        res.status = 403;
        res.end(`POST operation not supported on /todos/${req.params.todoId}`);
    })

    .put((req, res) => {
        res.write(`Updating the todo: ${req.params.todoId}\n`);
        res.end(
            `Will update the todo: ${req.body.name} with description: ${req.body.description}`
        );
    })

    .delete((req, res) => {
        res.end(`Deleting campsite: ${req.params.todoId}`);
    });

module.exports = todoRouter;
