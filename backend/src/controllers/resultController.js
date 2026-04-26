const Result = require('../models/Result');

/**
 * @desc    Get all results for the logged-in user
 * @route   GET /api/results/mine
 * @access  Student
 */
const getMyResults = async (req, res) => {
  try {
    const results = await Result.find({ userId: req.user._id })
      .populate('quizId', 'title category difficulty')
      .sort({ completedAt: -1 });

    res.json(results);
  } catch (error) {
    console.error('getMyResults error:', error.message);
    res.status(500).json({ message: 'Server error fetching results' });
  }
};

/**
 * @desc    Get a single result by ID
 * @route   GET /api/results/:id
 * @access  Protected
 */
const getResultById = async (req, res) => {
  try {
    const result = await Result.findById(req.params.id)
      .populate('quizId', 'title category difficulty')
      .populate('userId', 'name email');

    if (!result) {
      return res.status(404).json({ message: 'Result not found' });
    }

    // Students can only see their own results
    if (
      req.user.role === 'student' &&
      result.userId._id.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.json(result);
  } catch (error) {
    console.error('getResultById error:', error.message);
    res.status(500).json({ message: 'Server error fetching result' });
  }
};

/**
 * @desc    Get all results (admin view with user/quiz populated)
 * @route   GET /api/results/all
 * @access  Admin only
 */
const getAllResults = async (req, res) => {
  try {
    const results = await Result.find()
      .populate('userId', 'name email avatar')
      .populate('quizId', 'title category difficulty')
      .sort({ completedAt: -1 });

    res.json(results);
  } catch (error) {
    console.error('getAllResults error:', error.message);
    res.status(500).json({ message: 'Server error fetching all results' });
  }
};

/**
 * @desc    Get progress stats for the logged-in user
 * @route   GET /api/results/stats
 * @access  Student
 */
const getProgressStats = async (req, res) => {
  try {
    const userId = req.user._id;

    // Get all results for this user
    const results = await Result.find({ userId }).sort({ completedAt: -1 });

    const totalQuizzes = results.length;

    // Calculate average score
    const avgScore =
      totalQuizzes > 0
        ? Math.round(
            results.reduce((acc, r) => acc + r.percentage, 0) / totalQuizzes
          )
        : 0;

    // Calculate best streak (consecutive days with quiz attempts)
    let bestStreak = 0;
    if (results.length > 0) {
      // Get unique dates (formatted as YYYY-MM-DD)
      const uniqueDates = [
        ...new Set(
          results.map((r) =>
            new Date(r.completedAt).toISOString().split('T')[0]
          )
        ),
      ].sort();

      let currentStreak = 1;
      bestStreak = 1;

      for (let i = 1; i < uniqueDates.length; i++) {
        const prevDate = new Date(uniqueDates[i - 1]);
        const currDate = new Date(uniqueDates[i]);
        const diffDays = (currDate - prevDate) / (1000 * 60 * 60 * 24);

        if (diffDays === 1) {
          currentStreak++;
          bestStreak = Math.max(bestStreak, currentStreak);
        } else {
          currentStreak = 1;
        }
      }
    }

    // Last 7 days data
    const days = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
    const last7Days = [];

    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      const dayName = days[date.getDay()];

      // Find results for this day
      const dayResults = results.filter(
        (r) => new Date(r.completedAt).toISOString().split('T')[0] === dateStr
      );

      const dayAvg =
        dayResults.length > 0
          ? Math.round(
              dayResults.reduce((acc, r) => acc + r.percentage, 0) /
                dayResults.length
            )
          : 0;

      last7Days.push({
        day: dayName,
        score: dayAvg,
        date: dateStr,
      });
    }

    res.json({
      totalQuizzes,
      avgScore,
      bestStreak,
      last7Days,
    });
  } catch (error) {
    console.error('getProgressStats error:', error.message);
    res.status(500).json({ message: 'Server error fetching progress stats' });
  }
};

module.exports = {
  getMyResults,
  getResultById,
  getAllResults,
  getProgressStats,
};
