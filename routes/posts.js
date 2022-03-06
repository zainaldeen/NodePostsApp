const express = require('express');
const { body } = require('express-validator');
const postController = require('../controllers/posts');


const router = express.Router();

router.get('/posts', postController.getPosts);
router.post('/post', [
    body('title').trim().isLength({min: 8}),
    body('content').trim().isLength({min: 8}),
], postController.postPosts);

module.exports = router;
