import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../../api/axios';
import toast from 'react-hot-toast';
import Navbar from '../../components/common/Navbar';
import './QuizPage.css';

const QuizPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [quiz, setQuiz] = useState(null);
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState({});
  const [selectedOption, setSelectedOption] = useState(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const [totalTime, setTotalTime] = useState(0);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showResult, setShowResult] = useState(false);

  // Fetch quiz data
  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const { data } = await API.get(`/quizzes/${id}`);
        setQuiz(data);
        setTimeLeft(data.timeLimit || 600);
        setTotalTime(data.timeLimit || 600);
      } catch (error) {
        toast.error('Failed to load quiz');
        navigate('/student/dashboard');
      } finally {
        setLoading(false);
      }
    };
    fetchQuiz();
  }, [id, navigate]);

  // Submit quiz handler
  const handleSubmit = useCallback(async () => {
    if (submitting) return;
    setSubmitting(true);

    try {
      const formattedAnswers = Object.entries(answers).map(([questionId, selectedOption]) => ({
        questionId,
        selectedOption,
      }));

      const timeTaken = totalTime - timeLeft;

      const { data } = await API.post(`/quizzes/${id}/submit`, {
        answers: formattedAnswers,
        timeTaken,
      });

      toast.success('Quiz submitted successfully!');
      navigate(`/student/result/${data.resultId}`);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to submit quiz');
      setSubmitting(false);
    }
  }, [answers, id, navigate, submitting, timeLeft, totalTime]);

  // Timer countdown
  useEffect(() => {
    if (loading || !quiz || timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmit(); // Auto-submit on time up
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [loading, quiz, handleSubmit]);

  // Handle option selection
  const handleOptionSelect = (index) => {
    if (showResult) return;
    setSelectedOption(index);

    const question = quiz.questions[currentQ];
    setAnswers((prev) => ({
      ...prev,
      [question._id]: index,
    }));
  };

  // Navigation
  const goNext = () => {
    setSelectedOption(answers[quiz.questions[currentQ + 1]?._id] ?? null);
    setCurrentQ((prev) => Math.min(prev + 1, quiz.questions.length - 1));
    setShowResult(false);
  };

  const goPrev = () => {
    setSelectedOption(answers[quiz.questions[currentQ - 1]?._id] ?? null);
    setCurrentQ((prev) => Math.max(prev - 1, 0));
    setShowResult(false);
  };

  // Format time
  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  // SVG timer calculations
  const radius = 45;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference * (1 - timeLeft / totalTime);

  if (loading) {
    return (
      <div className="loading-overlay">
        <div className="spinner-gradient" style={{ width: '48px', height: '48px' }}></div>
      </div>
    );
  }

  if (!quiz) return null;

  const question = quiz.questions[currentQ];
  const isLastQuestion = currentQ === quiz.questions.length - 1;
  const progress = ((currentQ + 1) / quiz.questions.length) * 100;

  return (
    <div className="quiz-page">
      {/* Top Bar */}
      <div className="quiz-top-bar">
        <button className="btn btn-ghost btn-icon" onClick={() => navigate('/student/dashboard')}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"/>
            <line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>
        <h2 className="quiz-top-title">EduHub</h2>
        <div style={{ width: '40px' }} />
      </div>

      {/* Timer */}
      <div className="quiz-timer-container">
        <svg className="quiz-timer-svg" width="110" height="110" viewBox="0 0 110 110">
          <circle
            cx="55"
            cy="55"
            r={radius}
            fill="none"
            stroke="rgba(255,255,255,0.08)"
            strokeWidth="6"
          />
          <circle
            cx="55"
            cy="55"
            r={radius}
            fill="none"
            stroke="url(#timerGrad)"
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={dashOffset}
            transform="rotate(-90 55 55)"
            className="quiz-timer-ring"
          />
          <defs>
            <linearGradient id="timerGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#4A90D9" />
              <stop offset="100%" stopColor="#7B5EA7" />
            </linearGradient>
          </defs>
        </svg>
        <div className="quiz-timer-text">{formatTime(timeLeft)}</div>
      </div>

      {/* Progress */}
      <div className="quiz-progress-section">
        <p className="quiz-progress-label">Question {currentQ + 1} of {quiz.questions.length}</p>
        <div className="progress-bar" style={{ height: '5px' }}>
          <div className="progress-bar-fill" style={{ width: `${progress}%` }}></div>
        </div>
      </div>

      {/* Question Card */}
      <div className="quiz-question-card">
        <p className="quiz-question-text">{question.questionText}</p>
        <p className="quiz-question-meta">
          ⚡ {quiz.difficulty?.toUpperCase()} DIFFICULTY · {question.points} PTS
        </p>
      </div>

      {/* Options */}
      <div className="quiz-options">
        {question.options.map((option, index) => {
          const letter = String.fromCharCode(65 + index); // A, B, C, D
          const isSelected = selectedOption === index;

          return (
            <button
              key={index}
              className={`quiz-option ${isSelected ? 'selected' : ''}`}
              onClick={() => handleOptionSelect(index)}
            >
              <span className="quiz-option-letter">{letter}</span>
              <span className="quiz-option-text">{option.text}</span>
              {isSelected && (
                <span className="quiz-option-check">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Navigation Buttons */}
      <div className="quiz-nav-buttons">
        <button
          className="btn btn-ghost"
          onClick={goPrev}
          disabled={currentQ === 0}
        >
          PREVIOUS
        </button>

        {isLastQuestion ? (
          <button
            className="btn btn-primary"
            onClick={handleSubmit}
            disabled={submitting}
          >
            {submitting ? (
              <div className="spinner-sm" style={{ width: '18px', height: '18px', borderWidth: '2px' }}></div>
            ) : (
              'SUBMIT QUIZ'
            )}
          </button>
        ) : (
          <button className="btn btn-primary" onClick={goNext}>
            NEXT QUESTION →
          </button>
        )}
      </div>

      <div style={{ height: '80px' }} />
      <Navbar />
    </div>
  );
};

export default QuizPage;
