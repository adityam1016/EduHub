const User = require('../models/User');
const Result = require('../models/Result');

/**
 * @desc    Get all users (exclude passwords)
 * @route   GET /api/users
 * @access  Admin only
 */
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });

    // Add quiz count to each user
    const usersWithStats = await Promise.all(
      users.map(async (user) => {
        const quizCount = await Result.countDocuments({ userId: user._id });
        return {
          ...user.toObject(),
          quizzesTaken: quizCount,
        };
      })
    );

    res.json(usersWithStats);
  } catch (error) {
    console.error('getAllUsers error:', error.message);
    res.status(500).json({ message: 'Server error fetching users' });
  }
};

/**
 * @desc    Delete a user and their results
 * @route   DELETE /api/users/:id
 * @access  Admin only
 */
const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Prevent deleting yourself
    if (user._id.toString() === req.user._id.toString()) {
      return res.status(400).json({ message: 'Cannot delete your own account' });
    }

    // Delete user's results
    await Result.deleteMany({ userId: user._id });

    // Delete the user
    await User.findByIdAndDelete(user._id);

    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('deleteUser error:', error.message);
    res.status(500).json({ message: 'Server error deleting user' });
  }
};

/**
 * @desc    Update user role (toggle between student/admin)
 * @route   PATCH /api/users/:id/role
 * @access  Admin only
 */
const updateUserRole = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Prevent changing your own role
    if (user._id.toString() === req.user._id.toString()) {
      return res.status(400).json({ message: 'Cannot change your own role' });
    }

    const { role } = req.body;
    if (role && ['student', 'admin'].includes(role)) {
      user.role = role;
    } else {
      // Toggle role if no role specified
      user.role = user.role === 'student' ? 'admin' : 'student';
    }

    await user.save();

    res.json({
      message: `User role updated to '${user.role}'`,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('updateUserRole error:', error.message);
    res.status(500).json({ message: 'Server error updating user role' });
  }
};

/**
 * @desc    Create a new user (admin only)
 * @route   POST /api/users
 * @access  Admin only
 */
const createUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email, and password are required' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User with this email already exists' });
    }

    const validRole = ['student', 'admin'].includes(role) ? role : 'student';
    const user = await User.create({ name, email, password, role: validRole });

    res.status(201).json({
      message: `${validRole.charAt(0).toUpperCase() + validRole.slice(1)} created successfully`,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.error('createUser error:', error.message);
    res.status(500).json({ message: 'Server error creating user' });
  }
};

module.exports = {
  getAllUsers,
  deleteUser,
  updateUserRole,
  createUser,
};
