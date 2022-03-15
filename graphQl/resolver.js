const User = require('../models/user');
const bcrypt = require('bcrypt');
const validator = require('validator');
module.exports = {
    createUser: async function ({ userInput }, req){
        let errors = [];
        if (!validator.isEmail(userInput.email)) {
            errors.push({ message: 'Invalid Email'});
        }
        if (validator.isEmpty(userInput.password) || !validator.isLength(userInput.password, {min: 8})) {
            errors.push({ message: 'Too Short Password'});
        }
        if (errors.length > 0) {
            const error = new Error('Invalid Input!');
            error.code = 422;
            error.data = errors;
            throw error;
        }
        const existingUser = await User.findOne({email : userInput.email});
        if (existingUser) {
            const err = new Error('User Already has an account!');
            throw err;
        }
        const hashedPW = await bcrypt.hash(userInput.password, 12);
        const user = new User({
            email: userInput.email,
            name: userInput.name,
            password: hashedPW
        });
        const createdUser = await user.save();
        return {
            ...createdUser._doc,
            _id: createdUser._id.toString(),
        }
    }
}
