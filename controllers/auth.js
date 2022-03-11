const User = require('../models/user');
const { validationResult } = require('express-validator');
const { handleErrors } = require('../utils/utils');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


exports.signup = async (req, res, next) => {
    const email = req.body.email;
    const name = req.body.name;
    const password = req.body.password;
    const errors = validationResult(req);
    if (! errors.isEmpty()) {
        throw handleErrors('Invalid Inputs', 422, errors.array());
    }
    const hashedPass = await bcrypt.hash(password, 12);
        try {
            let user = new User({
                name : name,
                email : email,
                password : hashedPass,
                posts : [],
            });

            await user.save();
            res.status(201)
                .json({
                    message: 'Singed up successfully!!',
                    id : user._id
                })
        } catch(err) {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        }
}


exports.login = async (req, res, next) => {
    try {
        const email = req.body.email;
        const password = req.body.password;
        const authedUser = await User.findOne({email: email});
        if (!user) {
            throw handleErrors('Check Your Credentials Please!', 401);
        }
        const isEqual = await bcrypt.compare(password, user.password);
        if (!isEqual) {
            throw handleErrors('Check Your Credentials Please!', 401);
        }
        const token = await jwt.sign(
            {
                email: authedUser.email,
                userId: authedUser._id.toString(),
            },
            'longTokenTpMakeTheJWTSECRETASPOSSIBLE!!OK?',
            {
                expiresIn: '1h'
            }
        )
        res.status(200)
            .json({
                userId : authedUser._id.toString(),
                token: token
            })
    } catch(err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
}
