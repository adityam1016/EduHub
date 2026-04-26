const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');
const {
  getAllUsers,
  deleteUser,
  updateUserRole,
  createUser,
} = require('../controllers/userController');

const router = express.Router();

// All user management routes are admin only
router.use(protect, authorize('admin'));

// GET /api/users — get all users
router.get('/', getAllUsers);

// POST /api/users — create a new user (admin only)
router.post('/', createUser);

// DELETE /api/users/:id — delete a user
router.delete('/:id', deleteUser);

// PATCH /api/users/:id/role — update user role
router.patch('/:id/role', updateUserRole);

module.exports = router;
