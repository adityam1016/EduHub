const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');
const {
  getAllQuizzes,
  getQuizById,
  createQuiz,
  updateQuiz,
  deleteQuiz,
  publishQuiz,
  submitQuiz,
} = require('../controllers/quizController');

const router = express.Router();

// GET /api/quizzes — all roles (students see published only)
router.get('/', protect, getAllQuizzes);

// GET /api/quizzes/:id — all roles
router.get('/:id', protect, getQuizById);

// POST /api/quizzes — admin only
router.post('/', protect, authorize('admin'), createQuiz);

// PUT /api/quizzes/:id — admin only
router.put('/:id', protect, authorize('admin'), updateQuiz);

// DELETE /api/quizzes/:id — admin only
router.delete('/:id', protect, authorize('admin'), deleteQuiz);

// PATCH /api/quizzes/:id/publish — admin only
router.patch('/:id/publish', protect, authorize('admin'), publishQuiz);

// POST /api/quizzes/:id/submit — student only
router.post('/:id/submit', protect, authorize('student'), submitQuiz);

module.exports = router;
