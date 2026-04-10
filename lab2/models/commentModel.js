const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
    text: {
        type: String,
        required: [true, 'Comment cannot be empty']
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    video: {
        type: mongoose.Schema.ObjectId,
        ref: 'Video',
        required: [true, 'Comment must belong to a video']
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: [true, 'Comment must belong to a user']
    }
});

commentSchema.pre(/^find/, function() {
    this.populate({
        path: 'user',
        select: 'name email'
    });
});

const Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;
