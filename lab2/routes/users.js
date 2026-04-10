const express = require('express');
const router = express.Router();
const usersController = require('../controllers/usersController');
const protect = require('../middleware/protect');
const restrictTo = require('../middleware/restrictTo');

// Get all users
router.get('/', usersController.getAllUsers);

// Get user by ID
router.get('/:id', usersController.getUserById);

// Create user (protected)
router.post('/', protect, usersController.createUser);

// Delete user (Admin only) - Part 5: RBAC
router.delete('/:id', protect, restrictTo('admin'), usersController.deleteUser);

module.exports = router;
