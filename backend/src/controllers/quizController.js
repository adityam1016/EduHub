const Quiz = require('../models/Quiz');
const Question = require('../models/Question');
const Result = require('../models/Result');

/**
 * @desc    Get all quizzes (students see only published, admins see all)
 * @route   GET /api/quizzes
 * @access  Protected
 */
const getAllQuizzes = async (req, res) => {
  try {
    let filter = {};

    // Students can only see published quizzes
    if (req.user.role === 'student') {
      filter.isPublished = true;
    }

    const quizzes = await Quiz.find(filter)
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 });

    res.json(quizzes);
  } catch (error) {
    console.error('getAllQuizzes error:', error.message);
    res.status(500).json({ message: 'Server error fetching quizzes' });
  }
};

/**
 * @desc    Get a single quiz by ID (populate questions)
 * @route   GET /api/quizzes/:id
 * @access  Protected
 */
const getQuizById = async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id)
      .populate('questions')
      .populate('createdBy', 'name email');

    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }

    // Students can only see published quizzes
    if (req.user.role === 'student' && !quiz.isPublished) {
      return res.status(403).json({ message: 'This quiz is not published yet' });
    }

    res.json(quiz);
  } catch (error) {
    console.error('getQuizById error:', error.message);
    res.status(500).json({ message: 'Server error fetching quiz' });
  }
};

/**
 * @desc    Create a new quiz with questions
 * @route   POST /api/quizzes
 * @access  Admin only
 */
const createQuiz = async (req, res) => {
  try {
    const { title, description, category, difficulty, timeLimit, questions, isPublished } = req.body;

    // Create the quiz first
    const quiz = await Quiz.create({
      title,
      description,
      category,
      difficulty,
      timeLimit,
      isPublished: isPublished || false,
      createdBy: req.user._id,
    });

    // Create questions if provided
    if (questions && questions.length > 0) {
      const questionDocs = await Promise.all(
        questions.map((q) =>
          Question.create({
            quizId: quiz._id,
            questionText: q.questionText,
            options: q.options,
            points: q.points || 10,
            explanation: q.explanation || '',
          })
        )
      );

      // Add question IDs to the quiz
      quiz.questions = questionDocs.map((q) => q._id);
      await quiz.save();
    }

    // Return populated quiz
    const populatedQuiz = await Quiz.findById(quiz._id)
      .populate('questions')
      .populate('createdBy', 'name email');

    res.status(201).json(populatedQuiz);
  } catch (error) {
    console.error('createQuiz error:', error.message);
    res.status(500).json({ message: 'Server error creating quiz' });
  }
};

/**
 * @desc    Update a quiz
 * @route   PUT /api/quizzes/:id
 * @access  Admin only
 */
const updateQuiz = async (req, res) => {
  try {
    const { title, description, category, difficulty, timeLimit, questions, isPublished } = req.body;

    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }

    // Update quiz fields
    quiz.title = title || quiz.title;
    quiz.description = description !== undefined ? description : quiz.description;
    quiz.category = category || quiz.category;
    quiz.difficulty = difficulty || quiz.difficulty;
    quiz.timeLimit = timeLimit || quiz.timeLimit;
    quiz.isPublished = isPublished !== undefined ? isPublished : quiz.isPublished;

    // If questions are provided, replace them
    if (questions && questions.length > 0) {
      // Delete old questions
      await Question.deleteMany({ quizId: quiz._id });

      // Create new questions
      const questionDocs = await Promise.all(
        questions.map((q) =>
          Question.create({
            quizId: quiz._id,
            questionText: q.questionText,
            options: q.options,
            points: q.points || 10,
            explanation: q.explanation || '',
          })
        )
      );

      quiz.questions = questionDocs.map((q) => q._id);
    }

    await quiz.save();

    const populatedQuiz = await Quiz.findById(quiz._id)
      .populate('questions')
      .populate('createdBy', 'name email');

    res.json(populatedQuiz);
  } catch (error) {
    console.error('updateQuiz error:', error.message);
    res.status(500).json({ message: 'Server error updating quiz' });
  }
};

/**
 * @desc    Delete a quiz and its questions
 * @route   DELETE /api/quizzes/:id
 * @access  Admin only
 */
const deleteQuiz = async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }

    // Delete all questions belonging to this quiz
    await Question.deleteMany({ quizId: quiz._id });

    // Delete all results for this quiz
    await Result.deleteMany({ quizId: quiz._id });

    // Delete the quiz
    await Quiz.findByIdAndDelete(quiz._id);

    res.json({ message: 'Quiz deleted successfully' });
  } catch (error) {
    console.error('deleteQuiz error:', error.message);
    res.status(500).json({ message: 'Server error deleting quiz' });
  }
};

/**
 * @desc    Toggle publish status of a quiz
 * @route   PATCH /api/quizzes/:id/publish
 * @access  Admin only
 */
const publishQuiz = async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }

    quiz.isPublished = !quiz.isPublished;
    await quiz.save();

    res.json({
      message: `Quiz ${quiz.isPublished ? 'published' : 'unpublished'} successfully`,
      isPublished: quiz.isPublished,
    });
  } catch (error) {
    console.error('publishQuiz error:', error.message);
    res.status(500).json({ message: 'Server error toggling publish status' });
  }
};

/**
 * @desc    Submit quiz answers and get results
 * @route   POST /api/quizzes/:id/submit
 * @access  Student only
 */
const submitQuiz = async (req, res) => {
  try {
    const { answers, timeTaken } = req.body;
    const quizId = req.params.id;

    // Get quiz with questions
    const quiz = await Quiz.findById(quizId).populate('questions');
    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }

    if (!quiz.isPublished) {
      return res.status(403).json({ message: 'This quiz is not available' });
    }

    // Calculate score
    let correctAnswers = 0;
    let score = 0;

    const processedAnswers = answers.map((answer) => {
      const question = quiz.questions.find(
        (q) => q._id.toString() === answer.questionId
      );

      if (!question) {
        return { ...answer, isCorrect: false };
      }

      const isCorrect =
        question.options[answer.selectedOption] &&
        question.options[answer.selectedOption].isCorrect;

      if (isCorrect) {
        correctAnswers++;
        score += question.points;
      }

      return {
        questionId: answer.questionId,
        selectedOption: answer.selectedOption,
        isCorrect: !!isCorrect,
      };
    });

    const totalQuestions = quiz.questions.length;
    const percentage = totalQuestions > 0
      ? Math.round((correctAnswers / totalQuestions) * 100)
      : 0;

    // Save result
    const result = await Result.create({
      userId: req.user._id,
      quizId: quiz._id,
      quizTitle: quiz.title,
      score,
      totalQuestions,
      correctAnswers,
      timeTaken: timeTaken || 0,
      percentage,
      answers: processedAnswers,
    });

    res.status(201).json({
      resultId: result._id,
      quizTitle: quiz.title,
      score,
      totalQuestions,
      correctAnswers,
      percentage,
      timeTaken: timeTaken || 0,
    });
  } catch (error) {
    console.error('submitQuiz error:', error.message);
    res.status(500).json({ message: 'Server error submitting quiz' });
  }
};

module.exports = {
  getAllQuizzes,
  getQuizById,
  createQuiz,
  updateQuiz,
  deleteQuiz,
  publishQuiz,
  submitQuiz,
};
