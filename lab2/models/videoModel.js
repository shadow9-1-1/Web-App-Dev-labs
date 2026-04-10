const mongoose = require('mongoose');

const videoSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please provide a video title']
    },
    description: {
        type: String
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: [true, 'Video must belong to a user']
    }
}, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Virtual populate for comments
videoSchema.virtual('comments', {
    ref: 'Comment',
    foreignField: 'video',
    localField: '_id'
});

const Video = mongoose.model('Video', videoSchema);

module.exports = Video;
