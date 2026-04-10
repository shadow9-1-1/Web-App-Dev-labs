const Video = require('../models/videoModel');

// GET /videos - Get all videos (public) with filtering, sorting, pagination
exports.getAllVideos = async (req, res) => {
    try {
        // Filter
        const queryObj = { ...req.query };
        const excludedFields = ['page', 'sort', 'limit', 'fields'];
        excludedFields.forEach(el => delete queryObj[el]);

        // Advanced filtering
        let queryStr = JSON.stringify(queryObj);
        queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);

        let query = Video.find(JSON.parse(queryStr));

        // sorting
        if (req.query.sort) {
            const sortBy = req.query.sort.split(',').join(' ');
            query = query.sort(sortBy);
        } else {
            // Default sort by newest first
            query = query.sort('-createdAt');
        }

        
        if (req.query.fields) {
            const fields = req.query.fields.split(',').join(' ');
            query = query.select(fields);
        }

        // pagination
        const page = parseInt(req.query.page, 10) || 1;
        const limit = parseInt(req.query.limit, 10) || 10;
        const skip = (page - 1) * limit;

        query = query.skip(skip).limit(limit);

        // Populate user info
        query = query.populate({
            path: 'user',
            select: 'name email'
        });

        // Execute query
        const videos = await query;

        // Get total count for pagination info
        const total = await Video.countDocuments(JSON.parse(queryStr));

        res.status(200).json({
            success: true,
            results: videos.length,
            pagination: {
                currentPage: page,
                limit: limit,
                totalPages: Math.ceil(total / limit),
                totalResults: total
            },
            data: {
                videos
            }
        });
    } catch (err) {
        res.status(400).json({
            success: false,
            message: err.message
        });
    }
};

// GET /videos/:id - Get single video
exports.getVideo = async (req, res) => {
    try {
        const video = await Video.findById(req.params.id)
            .populate({
                path: 'user',
                select: 'name email'
            })
            .populate({
                path: 'comments',
                populate: {
                    path: 'user',
                    select: 'name email'
                }
            });

        if (!video) {
            return res.status(404).json({
                success: false,
                message: 'Video not found'
            });
        }

        res.status(200).json({
            success: true,
            data: {
                video
            }
        });
    } catch (err) {
        res.status(400).json({
            success: false,
            message: err.message
        });
    }
};

// POST /videos - Create video (protected)
exports.createVideo = async (req, res) => {
    try {
        // Add user ID from authenticated user
        req.body.user = req.user.id;

        const video = await Video.create(req.body);

        res.status(201).json({
            success: true,
            data: {
                video
            }
        });
    } catch (err) {
        res.status(400).json({
            success: false,
            message: err.message
        });
    }
};

// DELETE /videos/:id - Delete video (owner or admin only)
exports.deleteVideo = async (req, res) => {
    try {
        const video = await Video.findById(req.params.id);

        if (!video) {
            return res.status(404).json({
                success: false,
                message: 'Video not found'
            });
        }

        // Check if user is owner or admin
        if (video.user._id.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'You are not authorized to delete this video'
            });
        }

        await Video.findByIdAndDelete(req.params.id);

        res.status(200).json({
            success: true,
            message: 'Video deleted successfully',
            data: null
        });
    } catch (err) {
        res.status(400).json({
            success: false,
            message: err.message
        });
    }
};

// PUT /videos/:id - Update video (owner only)
exports.updateVideo = async (req, res) => {
    try {
        let video = await Video.findById(req.params.id);

        if (!video) {
            return res.status(404).json({
                success: false,
                message: 'Video not found'
            });
        }

        // Check if user is owner
        if (video.user._id.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'You are not authorized to update this video'
            });
        }

        video = await Video.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        res.status(200).json({
            success: true,
            data: {
                video
            }
        });
    } catch (err) {
        res.status(400).json({
            success: false,
            message: err.message
        });
    }
};
