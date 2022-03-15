const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const multer = require('multer');
const { graphqlHTTP } = require('express-graphql');
const graphqlResolvers = require('./graphQl/resolver');
const graphqlSchema = require('./graphQl/schema');

const { fileStorage, fileFilter } = require('./utils/utils');

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
    if (req.method === 'OPTIONS') {
        return res.sendStatus(200)
    }
    next();
})

app.use('/graphql', graphqlHTTP({
    schema: graphqlSchema,
    rootValue: graphqlResolvers,
    graphiql: true,
    formatError(err) {
        if (!err.originalError) {
            return err;
        }
        const data = err.originalError.data;
        const message = err.message || "An error occurred";
        const code = err.originalError.code || 500;
        return {
            message: message,
            code: code,
            data: data
        }
    }
}))

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
        const server = app.listen(8080);
    })
    .catch(err => {
        console.log(err);
    })
