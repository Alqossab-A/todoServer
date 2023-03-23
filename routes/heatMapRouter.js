const express = require('express');
const heatMapRouter = express.Router();

heatMapRouter
    .route('/')
    .all((req, res, next) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/plain');
        next();
    })

    .get((req, res) => {
        res.end('will send all the heatMap to you');
    })

    .post((req, res) => {
        res.end(
            `will add the heatMap: ${req.body.name} with description: ${req.body.description}`
        );
    })

    .put((req, res) => {
        res.statusCode = 403;
        res.end('PUT opration not supported on /heatMap');
    })

    .delete((req, res) => {
        res.statusCode = 403;
        res.end('delete opration not supported on /heatMap');
    });

heatMapRouter
    .route('/:heatMapId')
    .all((req, res, next) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/plain');
        next();
    })

    .get((req, res) => {
        res.end(
            `Will send details of the heatMap: ${req.params.heatMapId} to you`
        );
    })

    .post((req, res) => {
        res.status = 403;
        res.end(
            `POST operation not supported on /heatMap/${req.params.heatMapId}`
        );
    })

    .put((req, res) => {
        res.write(`Updating the heatMap: ${req.params.heatMapId}\n`);
        res.end(
            `Will update the heatMap: ${req.body.name} with description: ${req.body.description}`
        );
    })

    .delete((req, res) => {
        res.end(`Deleting heatMap: ${req.params.heatMapId}`);
    });

module.exports = heatMapRouter;
