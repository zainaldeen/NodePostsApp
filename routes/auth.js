const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const User = require('../models/user');
const authController = require('../controllers/auth');


router.put('/signup',
    [
        body('name')
            .isLength({$gt: 3}),
        body('email')
            .trim()
            .isEmail(),
        body('password')
            .trim()
            .isLength({$gt: 7})
            .isAlphanumeric(),
        
    ],
    authController.signup);

module.exports = router;
