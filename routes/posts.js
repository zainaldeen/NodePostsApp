const express = require('express');
const { body } = require('express-validator');
const postController = require('../controllers/posts');
const isAuth = require('../middleware/is-auth');

const router = express.Router();

router.get('/posts', isAuth, postController.getPosts);
router.get('/posts/:postId', isAuth, postController.getPostById);
router.post('/post',
    isAuth,
    [
        body('title').trim().isLength({min: 5}),
        body('content').trim().isLength({min: 5}),
    ],
    postController.postPosts);

router.put('/post/:postId', isAuth, postController.updatePost);
router.delete('/post/:postId', isAuth, postController.deletePost);

module.exports = router;
