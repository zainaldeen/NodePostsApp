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
exports.postPosts = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error('Please Input Valid Data!');
        error.statusCode= 422;
        throw error;
    }
    let title = req.body.title;
    let content = req.body.content;
    let post = new Post({
        title: title,
        content: content,
        creator: {
            name: "Zain "
        },
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
