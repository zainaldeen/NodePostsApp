const { validationResult } = require('express-validator');
const Post = require('../models/posts');
exports.getPosts = (req, res, next) => {
    Post.find()
        .then(posts => {
            res.status(200).json({
                'message': 'All Posts Available For You!',
                'posts': posts
            })
        })
        .catch(err => {
            console.log(err);
        });

}
exports.getPostById = (req, res, next) => {
    let postId = req.params.postId;
    Post.findById(postId)
        .then(post => {
            if (!post) {
                const error = new Error('Post Not Found!');
                error.statusCode = 404;
                throw error;
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
        const error = new Error('Please Input Valid Data!');
        error.statusCode= 422;
        throw error;
    }
    if (!req.file) {
        const error = new Error('No Image Provided!');
        error.statusCode= 422;
        throw error;
    }
    let imageURL = req.file.path;
    let title = req.body.title;
    let content = req.body.content;
    let post = new Post({
        title: title,
        content: content,
        creator: {
            name: "Zain "
        },
        imageURL: imageURL,
        createdAt: new Date()
    });
    post.save()
        .then(post => {
            res.status(200).json({
                'message': 'post Added!',
                'post':
                    {
                        _id: post._id,
                        title: post.title,
                        content: post.content,
                        creator: post.creator,
                        createdAt: Date.now()
                    },

            })
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        })

}
