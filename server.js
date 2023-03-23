const express = require('express');
const morgan = require('morgan');
const todoRouter = require('./routes/todoRouter');
const subTodoRouter = require('./routes/subTodoRouter');
const heatMapRouter = require('./routes/heatMapRouter');

const hostname = 'localhost';
const port = 3000;

const app = express();
app.use(morgan('dev'));
app.use(express.json());

app.use('/todos', todoRouter);
app.use('/subTodos', subTodoRouter);
app.use('/heatMap', heatMapRouter);

app.use(express.static(__dirname + '/public'));

app.use((req, res) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/html');
    res.end('<html><body><h1>This is an Express Server</h1></body></html>');
});

app.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}`);
});
