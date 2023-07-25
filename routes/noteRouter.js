const express = require('express');
const { Note } = require('../models/notes');
const authenticate = require('../authenticate');
const cors = require('./cors');

const noteRouter = express.Router();

noteRouter
    .route('/')
    .options(cors.corsWithOptions, authenticate.verifyUser, (req, res) =>
        res.sendStatus(200)
    )

    .get(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        Note.find({ userId: req.user._id, done: false  })
            .then((note) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(note);
            })
            .catch((err) => next(err));
    })

    .post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        const newNote = new Note({
            ...req.body,
            userId: req.user._id,
        });
        newNote
            .save()
            .then((note) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(note);
            })
            .catch((err) => next(err));
    })

    .put(cors.corsWithOptions, authenticate.verifyUser, (req, res) => {
        res.statusCode = 403;
        res.end('PUT opration not supported on /notes');
    })

    .delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        res.statusCode = 403;
        res.end('DELETE opration not supported on /notes');
    });

noteRouter
    .route('/:noteId')
    .options(cors.corsWithOptions, authenticate.verifyUser, (req, res) =>
        res.sendStatus(200)
    )

    .get(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        Note.findOne({ _id: req.params.noteId, userId: req.user._id })
            .then((note) => {
                if (note) {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(note);
                } else {
                    res.statusCode = 404;
                    res.setHeader('Content-Type', 'application/json');
                    res.json({ message: 'note not found' });
                }
            })
            .catch((err) => next(err));
    })

    .post(cors.corsWithOptions, authenticate.verifyUser, (req, res) => {
        res.status = 403;
        res.end(`POST operation not supported on /notes/${req.params.noteId}`);
    })

    .put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        Note.findById({ _id: req.params.noteId, userId: req.user._id })
            .then((note) => {
                if (note) {
                    Note.findByIdAndUpdate(
                        { _id: req.params.noteId, userId: req.user._id },
                        { $set: req.body },
                        { new: true }
                    ).then((note) => {
                        res.statusCode = 200;
                        res.setHeader('Content-Type', 'application/json');
                        res.json(note);
                    });
                } else {
                    res.statusCode = 404;
                    res.setHeader('Content-Type', 'application/json');
                    res.json({ message: 'note does not exist' });
                }
            })
            .catch((err) => next(err));
    })

    .delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        Note.findById({ _id: req.params.noteId, userId: req.user._id })
            .then((note) => {
                if (note) {
                    Note.findByIdAndDelete({
                        _id: req.params.noteId,
                        userId: req.user._id,
                    }).then((response) => {
                        res.statusCode = 200;
                        res.setHeader('Content-Type', 'application/json');
                        res.json(response);
                    });
                } else {
                    res.statusCode = 404;
                    res.setHeader('Content-Type', 'application/json');
                    res.json({ message: 'note does not exist' });
                }
            })
            .catch((err) => next(err));
    });

module.exports = noteRouter;
