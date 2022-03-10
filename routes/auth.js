const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const User = require('../models/user');
const authController = require('../controllers/auth');


router.put('/signup',
    [
        body('name')
            .trim()
            .not()
            .isEmpty()
            .withMessage('The name is to short!'),
        body('email')
            .trim()
            .isEmail()
            .withMessage('The email is not correct!')
            .custom((value, { req }) => {
                User.findOne({email, value})
                    .then(userDoc => {
                        return Promise.reject('This email is already in use!');
                    })
            })
            .normalizeEmail(),
        body('password')
            .trim()
            .isLength({min: 8})
            .isAlphanumeric(),
    ],
    authController.signup);

module.exports = router;
