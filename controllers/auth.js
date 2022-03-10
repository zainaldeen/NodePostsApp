const User = require('../models/user');
const { validationResult } = require('express-validator');
const { handleErrors } = require('../utils/utils');
const bcrypt = require('bcrypt');


exports.signup = (req, res, next) => {
    const email = req.body.email;
    const name = req.body.name;
    const password = req.body.password;
    const errors = validationResult(req);
    if (! errors.isEmpty()) {
        throw handleErrors('Invalid Inputs', errors.array());
    }
    let newUser = new User();
    bcrypt.hash(password, 12)
        .then(hashedPass => {
            newUser.name = name;
            newUser.email = email;
            newUser.password = hashedPass;
            newUser.posts = [];
            newUser.save();
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        })
}
