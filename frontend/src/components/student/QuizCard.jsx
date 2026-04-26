import { useNavigate } from 'react-router-dom';
import './QuizCard.css';

const difficultyColors = {
  Easy: 'var(--color-success)',
  Medium: 'var(--color-warning)',
  Hard: 'var(--color-error)',
};

const QuizCard = ({ quiz, onStart, variant = 'default' }) => {
  const navigate = useNavigate();

  const handleStart = () => {
    if (onStart) {
      onStart(quiz);
    } else {
      navigate(`/student/quiz/${quiz._id}`);
    }
  };

  // Score history variant (for dashboard recent results)
  if (variant === 'history') {
    return (
      <div className="quiz-card-history">
        <div className="quiz-card-history-left">
          <div
            className="quiz-card-dot"
            style={{ background: difficultyColors[quiz.difficulty] || 'var(--accent-purple)' }}
          />
          <div>
            <h4 className="quiz-card-history-title">{quiz.quizTitle || quiz.title}</h4>
            <p className="quiz-card-history-date">
              {quiz.completedAt
                ? new Date(quiz.completedAt).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })
                : quiz.category}
            </p>
          </div>
        </div>
        <div className="quiz-card-history-score">
          <span className="pill pill-success">
            {quiz.correctAnswers}/{quiz.totalQuestions} · {quiz.percentage}%
          </span>
        </div>
      </div>
    );
  }

  // Default quiz card
  return (
    <div className="quiz-card">
      <div className="quiz-card-header">
        <h3 className="quiz-card-title">{quiz.title}</h3>
        <span
          className="badge"
          style={{
            background: `${difficultyColors[quiz.difficulty]}20`,
            color: difficultyColors[quiz.difficulty],
          }}
        >
          {quiz.difficulty}
        </span>
      </div>

      {quiz.description && (
        <p className="quiz-card-desc">{quiz.description}</p>
      )}

      <div className="quiz-card-meta">
        <span className="quiz-card-meta-item">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 19.5A2.5 2.5 0 016.5 17H20"/>
            <path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"/>
          </svg>
          {quiz.questions?.length || 0} Questions
        </span>
        <span className="quiz-card-meta-item">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"/>
            <polyline points="12 6 12 12 16 14"/>
          </svg>
          {Math.floor((quiz.timeLimit || 600) / 60)} min
        </span>
        <span className="quiz-card-meta-item badge badge-purple" style={{ padding: '3px 8px' }}>
          {quiz.category}
        </span>
      </div>

      <button className="btn btn-primary btn-full quiz-card-btn" onClick={handleStart}>
        Start Quiz
      </button>
    </div>
  );
};

export default QuizCard;
