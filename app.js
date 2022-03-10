const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const multer = require('multer');

const { fileStorage, fileFilter } = require('./utils/utils');
const postRouter = require('./routes/posts');
const authRouter = require('./routes/auth');
const isAuth = require('./middleware/is-auth');
const app = express();

const MONGODB_URI = 'mongodb+srv://root:root@trainingapp.crp6h.mongodb.net/feeds-app?authSource=admin&replicaSet=atlas-azjdlh-shard-0&readPreference=primary&appname=MongoDB%20Compass&ssl=true';


app.use(bodyParser.json()); // for Application/json format
app.use(
    multer({storage: fileStorage, fileFilter: fileFilter})
        .single('image')
);

app.use('/storage', express.static(path.join(__dirname, 'storage')));

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
})

app.use('/feeds', postRouter);
app.use('/auth', authRouter);

app.use((error, req, res, next) => {
    let status = error.statusCode || 500;
    let message = error.message;
    let data = error.data;
    return res.status(status).json({
        message: message,
        data: data,
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
