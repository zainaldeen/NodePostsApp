const express = require('express');
const { body } = require('express-validator');
const postController = require('../controllers/posts');


const router = express.Router();

router.get('/posts', postController.getPosts);
router.get('/posts/:postId', postController.getPostById);
router.post('/post', [
    body('title').trim().isLength({min: 5}),
    body('content').trim().isLength({min: 5}),
], postController.postPosts);

router.put('/post/:postId', postController.updatePost);
router.delete('/post/:postId', postController.deletePost);

module.exports = router;
