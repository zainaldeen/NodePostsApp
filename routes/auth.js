const express = require('express');
const { body } = require('express-validator');
const authController = require('../controllers/auth');

const User = require('../models/user');

const router = express.Router();

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
                return User.findOne({email: value})
                    .then(userDoc => {
                        if (userDoc){
                            return Promise.reject('This email is already in use!');
                        }
                    })
            })
            .normalizeEmail(),
        body('password')
            .trim()
            .isLength({min: 8})
            .isAlphanumeric(),
    ],
    authController.signup);

router.post('/login', authController.login);
module.exports = router;
