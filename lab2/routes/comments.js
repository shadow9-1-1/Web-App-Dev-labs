const express = require('express');
const router = express.Router({ mergeParams: true }); // Enable access to parent route params
const commentController = require('../controllers/commentController');
const protect = require('../middleware/protect');

// GET /videos/:videoId/comments - Get all comments for a video (public)
router.get('/', commentController.getComments);

// POST /videos/:videoId/comments - Create comment (protected - logged in users only)
router.post('/', protect, commentController.createComment);

// PUT /videos/:videoId/comments/:commentId - Update comment (owner only)
router.put('/:commentId', protect, commentController.updateComment);

// DELETE /videos/:videoId/comments/:commentId - Delete comment (owner or admin)
router.delete('/:commentId', protect, commentController.deleteComment);

module.exports = router;
