const mongoose = require('mongoose');
const { Schema } = mongoose;

const postSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    imageURL: {
        type: String,
        required: true
    },
    creator: {
        type: Object,
        required: true
    },
    createdAt: {
        type: Date,
        required: true
    },
}, {timestamps: true})


module.exports = mongoose.model('Post', postSchema);
