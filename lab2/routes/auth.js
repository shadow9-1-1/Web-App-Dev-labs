const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const protect = require('../middleware/protect');

// Public routes
router.post('/signup', authController.signup);
router.post('/login', authController.login);

// Protected route - GET /me
router.get('/me', protect, authController.getMe);

module.exports = router;
