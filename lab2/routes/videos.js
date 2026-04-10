const express = require('express');
const router = express.Router();
const videoController = require('../controllers/videoController');
const protect = require('../middleware/protect');
const commentRouter = require('./comments');

// Nested route: /videos/:videoId/comments
router.use('/:videoId/comments', commentRouter);

// Public route - Get all videos (with filtering, sorting, pagination)
router.get('/', videoController.getAllVideos);

// Public route - Get single video (with comments)
router.get('/:id', videoController.getVideo);

// Protected routes - Require authentication
router.post('/', protect, videoController.createVideo);
router.put('/:id', protect, videoController.updateVideo);
router.delete('/:id', protect, videoController.deleteVideo);

module.exports = router;
