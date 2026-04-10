const Comment = require('../models/commentModel');
const Video = require('../models/videoModel');

// GET /videos/:videoId/comments - Get all comments for a video
exports.getComments = async (req, res) => {
    try {
        const { videoId } = req.params;

        const video = await Video.findById(videoId);
        if (!video) {
            return res.status(404).json({
                success: false,
                message: 'Video not found'
            });
        }

        const comments = await Comment.find({ video: videoId })
            .sort('-createdAt');

        res.status(200).json({
            success: true,
            results: comments.length,
            data: {
                comments
            }
        });
    } catch (err) {
        res.status(400).json({
            success: false,
            message: err.message
        });
    }
};

// POST /videos/:videoId/comments - Create a comment (protected)
exports.createComment = async (req, res) => {
    try {
        const { videoId } = req.params;

        const video = await Video.findById(videoId);
        if (!video) {
            return res.status(404).json({
                success: false,
                message: 'Video not found'
            });
        }

        const comment = await Comment.create({
            text: req.body.text,
            video: videoId,
            user: req.user.id
        });

        res.status(201).json({
            success: true,
            data: {
                comment
            }
        });
    } catch (err) {
        res.status(400).json({
            success: false,
            message: err.message
        });
    }
};

// DELETE /videos/:videoId/comments/:commentId - Delete a comment (owner or admin only)
exports.deleteComment = async (req, res) => {
    try {
        const { videoId, commentId } = req.params;

        const comment = await Comment.findById(commentId);

        if (!comment) {
            return res.status(404).json({
                success: false,
                message: 'Comment not found'
            });
        }

        if (comment.video.toString() !== videoId) {
            return res.status(400).json({
                success: false,
                message: 'Comment does not belong to this video'
            });
        }

        if (comment.user._id.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'You are not authorized to delete this comment'
            });
        }

        await Comment.findByIdAndDelete(commentId);

        res.status(200).json({
            success: true,
            message: 'Comment deleted successfully',
            data: null
        });
    } catch (err) {
        res.status(400).json({
            success: false,
            message: err.message
        });
    }
};

// PUT /videos/:videoId/comments/:commentId - Update a comment (owner only)
exports.updateComment = async (req, res) => {
    try {
        const { videoId, commentId } = req.params;

        let comment = await Comment.findById(commentId);

        if (!comment) {
            return res.status(404).json({
                success: false,
                message: 'Comment not found'
            });
        }

        if (comment.video.toString() !== videoId) {
            return res.status(400).json({
                success: false,
                message: 'Comment does not belong to this video'
            });
        }

        if (comment.user._id.toString() !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: 'You are not authorized to update this comment'
            });
        }

        comment = await Comment.findByIdAndUpdate(
            commentId,
            { text: req.body.text },
            { new: true, runValidators: true }
        );

        res.status(200).json({
            success: true,
            data: {
                comment
            }
        });
    } catch (err) {
        res.status(400).json({
            success: false,
            message: err.message
        });
    }
};
