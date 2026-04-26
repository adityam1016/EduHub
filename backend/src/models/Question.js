const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  quizId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Quiz',
    required: true,
  },
  questionText: {
    type: String,
    required: [true, 'Question text is required'],
  },
  options: [
    {
      text: { type: String, required: true },
      isCorrect: { type: Boolean, default: false },
    },
  ],
  points: {
    type: Number,
    default: 10,
  },
  explanation: {
    type: String,
    default: '',
  },
});

module.exports = mongoose.model('Question', questionSchema);
