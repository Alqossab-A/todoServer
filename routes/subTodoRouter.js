const express = require('express');
const subTodoRouter = express.Router();

subTodoRouter
    .route('/')
    .all((req, res, next) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/plain');
        next();
    })

    .get((req, res) => {
        res.end('will send all the subTodos to you');
    })

    .post((req, res) => {
        res.end(
            `will add the subTodo: ${req.body.name} with description: ${req.body.description}`
        );
    })

    .put((req, res) => {
        res.statusCode = 403;
        res.end('PUT opration not supported on /subTodos');
    })

    .delete((req, res) => {
        res.end('deleteing all subTodos');
    });

subTodoRouter
    .route('/:subTodoId')
    .all((req, res, next) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/plain');
        next();
    })

    .get((req, res) => {
        res.end(`Will send details of the subTodo: ${req.params.subTodoId} to you`);
    })

    .post((req, res) => {
        res.status = 403;
        res.end(`POST operation not supported on /subTodos/${req.params.subTodoId}`);
    })

    .put((req, res) => {
        res.write(`Updating the subTodo: ${req.params.subTodoId}\n`);
        res.end(
            `Will update the Subtodo: ${req.body.name} with description: ${req.body.description}`
        );
    })

    .delete((req, res) => {
        res.end(`Deleting campsite: ${req.params.subTodoId}`);
    });

module.exports = subTodoRouter;