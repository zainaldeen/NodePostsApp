const { validationResult } = require('express-validator');
const fs = require('fs');
const path = require('path');
const Post = require('../models/post');
const User = require('../models/user');
const io = require('../socket');
const { handleErrors } = require('../utils/utils');


exports.getPosts = async (req, res, next) => {
    const page = req.query.page || 1;
    const perPage = req.query.perPage || 2;
    try {
        const totalItems = await Post.countDocuments();
        const posts = await Post.find().skip((page - 1) * perPage).limit(perPage);
        res.status(200).json({
            'message': 'All Posts Available For You!',
            'posts': posts,
            'page': page,
            'perPage': perPage,
            'totalItems': totalItems
        })
    }
    catch(err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
}
exports.getPostById = async (req, res, next) => {
    try {
        let postId = req.params.postId;
        const post = await Post.findById(postId);
        if (!post) {
            throw handleErrors('Post Not Found!!!', 404)
        }
        res.status(200).json({
            'message': 'Success!',
            'post': post
        })
    } catch(err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
}
exports.postPosts = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            throw handleErrors('Please Input Valid Data!', 422)
        }
        if (!req.file) {
            throw handleErrors('No Image Provided!', 422)
        }
        let imageURL = req.file.path;
        let title = req.body.title;
        let content = req.body.content;
        let creator;
        let post = new Post({
            title: title,
            content: content,
            creator: req.userId,
            imageURL: imageURL,
            createdAt: new Date()
        });
        await post.save();
        const user = await User.findById(req.userId);
        user.posts.push(post);
        creator = user;
        await user.save();
        io.getIO().emit('posts', {action: 'create', post: post, creator: creator});
        res.status(201).json({
            'message': 'post Added!',
            'post': post,
            'creator': {
                _id : creator._id,
                name: creator.name
            }
        })
    }catch(err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }

}


exports.updatePost = async (req, res, next) => {
    try {
        const postId = req.params.postId;

        let title = req.body.title;
        let content = req.body.content;
        let imageURL = req.body.image;
        let userId = req.userId;
        if (!imageURL) {
            imageURL = req.file.path;
        }
        if (!imageURL) {
            throw handleErrors('No Image Selected!!', 422);
        }
        const post = await Post.findById(postId);
            if (!post) {
                throw handleErrors('Post Not Found!', 404)
            }
            if (post.creator.toString() !== userId) {
                return res.status(403)
                    .json({
                        message: "Unauthorized!"
                    })
            }
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                throw handleErrors('Please Input Valid Data!', 422)
            }
            if (imageURL !== post.imageURL) {
                clearImage(post.imageURL);
            }
            post.title = title;
            post.content = content;
            post.imageURL = imageURL;
            post.save();
            res.status(201).json({
                message: 'Post Updated Successfully!',
                post: post
            });
    } catch(err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
}

exports.deletePost = async (req, res, next) => {
    try {
        const postId = req.params.postId;
        const userId = req.userId;
        const post = await Post.findOne({ _id: postId});
        if (!post) {
            throw handleErrors('NOT FOUND!', 404);
        }
        if (post.creator.toString() !== userId) {
            return res.status(403)
                .json({
                    message: "Unauthorized!"
                })
        }
        clearImage(post.imageURL);
        await post.delete();
        const user = await User.findOne({_id: req.userId});
        user.posts.pull(postId);
        await user.save();
        res.status(200).json({
            message: 'Post Deleted Successfully!'
        })
    } catch(err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
}
clearImage = filename => {
    filename = path.join(__dirname, '..', filename);
    fs.unlink(filename, err => console.log(err));
}
