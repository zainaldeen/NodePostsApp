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
        throw handleErrors('Invalid Inputs', 422, errors.array());
    }
    bcrypt.hash(password, 12)
        .then(hashedPass => {
            let user = new User({
                name : name,
                email : email,
                password : hashedPass,
                posts : [],
            });

            return user.save();
        })
        .then(user => {
            res.status(201)
                .json({
                    message: 'Singed up successfully!!',
                    id : user._id
                })
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        })
}
