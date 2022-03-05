const express = require('express');
const bodyParser = require('body-parser');

const postRouter = require('./routes/posts');
const app = express();

app.use(bodyParser.json()); // for Application/json format

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authentication');
    next();
})

app.use('/feeds', postRouter);


app.listen(8080);
