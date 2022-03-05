exports.getPosts = (req, res, next) => {
    res.status(200).json({
        'message': 'All Posts Available For You!',
        'posts': [
            {'title': 'First post', 'content': 'any content now!!!'},
            {'title': 'Second post', 'content': 'any content now!!!'},
            {'title': 'Third post', 'content': 'any content now!!!'},
            {'title': 'Fourth post', 'content': 'any content now!!!'},
        ]
    })
}
exports.postPosts = (req, res, next) => {
    let title = req.body.title;
    let content = req.body.content;
    res.status(200).json({
        'message': 'post Added!',
        'post': [
            {'id': Date.now().toString() , 'title': title, 'content': content},
        ]
    })
}
