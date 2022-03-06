const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const postRouter = require('./routes/posts');
const app = express();

const MONGODB_URI = 'mongodb+srv://root:root@trainingapp.crp6h.mongodb.net/feeds-app?authSource=admin&replicaSet=atlas-azjdlh-shard-0&readPreference=primary&appname=MongoDB%20Compass&ssl=true';
app.use(bodyParser.json()); // for Application/json format

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authentication');
    next();
})

app.use('/feeds', postRouter);

app.use((error, req, res, next) => {
    let status = error.statusCode || 500;
    let message = error.message;
    return res.status(status).json({
        message: message,
    })
})

mongoose
    .connect( MONGODB_URI )
    .then(result => {
        app.listen(8080);
    })
    .catch(err => {
        console.log(err);
    })
