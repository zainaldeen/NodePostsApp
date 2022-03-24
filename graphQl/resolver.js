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
            throw err = new Error('User Already has an account!');
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
        errors = this.checkValidation(postInput);
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

    getPosts: async function({ pagination }, req) {
        if (!req.isAuth) {
            const error = new Error("Unauthenticated");
            error.code = 401;
            throw error;
        }
        let page = pagination.page > 0 ? pagination.page : 1;
        let perPage = pagination.perPage > 0 ?  pagination.perPage : 2;

        const totalItems = await Post.find().countDocuments();
        const posts = await Post.find()
            .sort({ createdAt: -1})
            .populate('creator')
            .skip((page -1) * perPage)
            .limit(perPage);
        return {
            posts: posts.map(p => {
                return {
                    ...p._doc,
                    _id: p._id.toString(),
                    createdAt: p.createdAt.toISOString(),
                    updatedAt: p.updatedAt.toISOString()
                }
            }),
            totalItems: totalItems,
        }
    },

    getPostById: async function({ postId }, req) {
        if (!req.isAuth) {
            const error = new Error("Unauthenticated");
            error.code = 401;
            throw error;
        }
        const post =  await Post
            .findOne({ _id: postId})
            .populate('creator');

        if (!post) {
            const error = new Error("Not Found");
            error.code = 404;
            throw error;
        }
        return {
            ...post._doc,
            _id: post._id.toString(),
            createdAt: post.createdAt.toISOString(),
            updatedAt: post.updatedAt.toISOString()
        }
    },
    async updatePost({ postId, postData }, req) {
        let errors = [];
        if (!req.isAuth) {
            const err = new Error('Unauthorized');
            err.code = 401;
            throw err;
        }

        const post = await Post.findOne({_id: postId}).populate('creator');
        if (!post) {
            const error = new Error("Not Found");
            error.code = 404;
            throw error;
        }
        if (post.creator._id.toString() !== req.userId.toString()) {
            const error = new Error("Unauthorized");
            error.code = 403;
            throw error;
        }
        errors = this.checkValidation(postData);
        if (errors.length > 0) {
            const error = new Error('Invalid data');
            error.code = 422;
            error.data = errors;
            throw error;
        }

        console.log(postData);
        post.title = postData.title;
        post.content = postData.content;
        if (postData.imageURL !== 'undefined'){
            post.imageURL = postData.imageURL;
        }
        let updatedPost = await post.save();
        return {
            ...updatedPost._doc,
            _id: updatedPost._id.toString(),
            createdAt: updatedPost.createdAt.toISOString(),
            updatedAt: updatedPost.updatedAt.toISOString()
        }
    },

    checkValidation(postInput) {
        let errors = [];
        if (validator.isEmpty(postInput.title) || !validator.isLength(postInput.title, { min: 5})) {
            errors.push({message: "Invalid title for post", status: 422});
        }
        if (validator.isEmpty(postInput.content) || !validator.isLength(postInput.content, { min: 5})) {
            errors.push({message: "Invalid content for post", status: 422});
        }
        if (validator.isEmpty(postInput.imageURL)) {
            errors.push({message: "Invalid imageURL for post", status: 422});
        }
        return errors;
    }
}
