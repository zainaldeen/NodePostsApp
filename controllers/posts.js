const { validationResult } = require('express-validator');
const fs = require('fs');
const path = require('path');
const Post = require('../models/post');
const User = require('../models/user');
const { handleErrors } = require('../utils/utils');
exports.getPosts = (req, res, next) => {
    const page = req.query.page || 1;
    const perPage = req.query.perPage || 2;
    let totalItems;
    Post
        .countDocuments()
        .then(total => {
            totalItems = total;
            Post.find()
                .skip((page - 1) * perPage)
                .limit(perPage)
                .then(posts => {
                    res.status(200).json({
                        'message': 'All Posts Available For You!',
                        'posts': posts,
                        'page': page,
                        'perPage': perPage,
                        'totalItems': totalItems
                    })
                })
                .catch(err => {
                    if (!err.statusCode) {
                        err.statusCode = 500;
                    }
                    next(err);
                })

        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        })

}
exports.getPostById = (req, res, next) => {
    let postId = req.params.postId;
    Post.findById(postId)
        .then(post => {
            if (!post) {
                throw handleErrors('Post Not Found!!!', 404)
            }
            res.status(200).json({
                'message': 'Success!',
                'post': post
            })
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        });

}
exports.postPosts = (req, res, next) => {
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
    post.save()
        .then(post => {
            return User.findById(req.userId);
        })
        .then(user => {
            user.posts.push(post);
            creator = user;
            return user.save();
        })
        .then(result => {
            res.status(201).json({
                'message': 'post Added!',
                'post': post,
                'creator': {
                    _id : creator._id,
                    name: creator.name
                }
            })
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        })


}


exports.updatePost = (req, res, next) => {
    const postId = req.params.postId;

    let title = req.body.title;
    let content = req.body.content;
    let imageURL = req.body.image;
    if (!imageURL) {
        imageURL = req.file.path;
    }
    if (!imageURL) {
        throw handleErrors('No Image Selected!!', 422);
    }
    Post.findById(postId)
        .then(post => {
            if (!post) {
                throw handleErrors('Post Not Found!', 404)
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
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        })
}

exports.deletePost = (req, res, next) => {
    const postId = req.params.postId;
    Post.findOneAndDelete({ _id: postId})
        .then(result => {
            res.status(200).json({
                message: 'Post Deleted Successfully!'
            })
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        })
}
clearImage = filename => {
    filename = path.join(__dirname, '..', filename);
    fs.unlink(filename, err => console.log(err));
}
