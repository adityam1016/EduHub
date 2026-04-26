const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');
const {
  getMyResults,
  getResultById,
  getAllResults,
  getProgressStats,
} = require('../controllers/resultController');

const router = express.Router();

// GET /api/results/mine — student's own results
router.get('/mine', protect, authorize('student'), getMyResults);

// GET /api/results/stats — student's progress stats
router.get('/stats', protect, authorize('student'), getProgressStats);

// GET /api/results/all — admin: all results
router.get('/all', protect, authorize('admin'), getAllResults);

// GET /api/results/:id — any authenticated user (ownership checked in controller)
router.get('/:id', protect, getResultById);

module.exports = router;
