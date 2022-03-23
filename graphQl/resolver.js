const User = require('../models/user');
const Post = require('../models/post');
const bcrypt = require('bcrypt');
const validator = require('validator');
const jwt = require('jsonwebtoken');

module.exports = {
    createUser: async function ({ userInput }, req){
        console.log(userInput);
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
    },

    logIn: async function ({ loginData }) {
        const user = await User.findOne({email: loginData.email});
        if (!user) {
            const error = new Error("Check your credentials");
            error.code = 401;
            throw error;
        }
        const isEqual = await bcrypt.compare(loginData.password, user.password);
        if (!isEqual){
            const error = new Error("Check your credentials");
            error.code = 401;
            throw error;
        }
        const token = await jwt.sign({
            email: user.email,
            userId: user._id.toString()
        },
            'longTokenTpMakeTheJWTSECRETASPOSSIBLE!!OK?',
            {
                expiresIn: '1h'
            }
        )
        return {
            userId: user._id.toString(),
            token: token
        }
    },

    createPost: async function({ postInput }, req) {
        let errors = [];
        if (!req.isAuth) {
            const error = new Error("Unauthenticated");
            error.code = 401;
            throw error;
        }
        if (validator.isEmpty(postInput.title) || !validator.isLength(postInput.title, { min: 5})) {
            errors.push({message: "Invalid title for post", status: 422});
        }
        if (validator.isEmpty(postInput.content) || !validator.isLength(postInput.content, { min: 5})) {
            errors.push({message: "Invalid content for post", status: 422});
        }
        if (validator.isEmpty(postInput.imageURL)) {
            errors.push({message: "Invalid imageURL for post", status: 422});
        }
        if (errors.length > 0) {
            const error = new Error('Invalid data');
            error.code = 422;
            error.data = errors;
            throw error;
        }
        const user = await User.findById(req.userId);

        const post = new Post({
            title: postInput.title,
            content: postInput.content,
            imageURL: postInput.imageURL,
            creator: user,
            createdAt: Date.now(),
        })
        const savedPost = await post.save();
        user.posts.push(post);
        await user.save();
        return {
            ...savedPost._doc,
            _id: savedPost._id.toString(),
            createdAt: savedPost.createdAt.toISOString(),
            updatedAt: savedPost.updatedAt.toISOString()
        }
    },

    posts: async function() {
        const posts = await Post.find().populate('creator');
        return {
            posts: posts,
            totalItems: posts.length,
        }
    }
}
