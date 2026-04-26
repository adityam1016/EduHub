import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../../api/axios';
import Navbar from '../../components/common/Navbar';
import './ResultPage.css';

const ResultPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [animatedPercent, setAnimatedPercent] = useState(0);

  useEffect(() => {
    const fetchResult = async () => {
      try {
        const { data } = await API.get(`/results/${id}`);
        setResult(data);
      } catch (error) {
        console.error('Error fetching result:', error);
        navigate('/student/dashboard');
      } finally {
        setLoading(false);
      }
    };
    fetchResult();
  }, [id, navigate]);

  // Animate score ring
  useEffect(() => {
    if (!result) return;
    const target = result.percentage;
    const duration = 1200;
    const steps = 60;
    const increment = target / steps;
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        current = target;
        clearInterval(timer);
      }
      setAnimatedPercent(Math.round(current));
    }, duration / steps);

    return () => clearInterval(timer);
  }, [result]);

  // Format time
  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  // Performance label
  const getPerformanceLabel = (pct) => {
    if (pct >= 90) return { text: 'Outstanding Performance 🔥', color: 'var(--color-success)' };
    if (pct >= 70) return { text: 'Great Job! 💪', color: 'var(--accent-blue)' };
    if (pct >= 50) return { text: 'Good Effort! 👍', color: 'var(--color-warning)' };
    return { text: 'Keep Practicing! 📚', color: 'var(--color-error)' };
  };

  // SVG score ring
  const radius = 60;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference * (1 - animatedPercent / 100);

  if (loading) {
    return (
      <div className="loading-overlay">
        <div className="spinner-gradient" style={{ width: '48px', height: '48px' }}></div>
      </div>
    );
  }

  if (!result) return null;

  const perf = getPerformanceLabel(result.percentage);
  const wrongAnswers = result.totalQuestions - result.correctAnswers;

  return (
    <div className="result-page">
      <h1 className="result-title">Quiz Completed 🎉</h1>
      <p className="result-subtitle">Here&apos;s how you performed</p>

      {/* Score Ring */}
      <div className="result-ring-container">
        <svg width="150" height="150" viewBox="0 0 150 150" className="result-ring-svg">
          <circle cx="75" cy="75" r={radius} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="8" />
          <circle
            cx="75"
            cy="75"
            r={radius}
            fill="none"
            stroke="url(#scoreGrad)"
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={dashOffset}
            transform="rotate(-90 75 75)"
            className="result-ring-circle"
          />
          <defs>
            <linearGradient id="scoreGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#4A90D9" />
              <stop offset="100%" stopColor="#7B5EA7" />
            </linearGradient>
          </defs>
        </svg>
        <div className="result-ring-text">
          <span className="result-ring-value">{animatedPercent}%</span>
          <span className="result-ring-label">SCORE</span>
        </div>
      </div>

      <p className="result-correct-text">
        {result.correctAnswers}/{result.totalQuestions} Correct Answers
      </p>
      <p className="result-performance" style={{ color: perf.color }}>{perf.text}</p>

      {/* Stat Chips */}
      <div className="result-chips">
        <div className="result-chip">
          <span className="result-chip-label">TIME</span>
          <span className="result-chip-value">{formatTime(result.timeTaken)}</span>
        </div>
        <div className="result-chip result-chip-success">
          <span className="result-chip-label">CORRECT</span>
          <span className="result-chip-value">{result.correctAnswers}</span>
        </div>
        <div className="result-chip result-chip-error">
          <span className="result-chip-label">WRONG</span>
          <span className="result-chip-value">{wrongAnswers}</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="result-actions">
        <button
          className="btn btn-primary btn-full"
          onClick={() => setShowAnalysis(!showAnalysis)}
        >
          {showAnalysis ? 'Hide Analysis' : 'View Detailed Analysis'}
        </button>
        <button
          className="btn btn-ghost btn-full"
          onClick={() => navigate('/student/dashboard')}
        >
          Back to Dashboard
        </button>
      </div>

      {/* Detailed Analysis */}
      {showAnalysis && result.answers && (
        <div className="result-analysis">
          <h3 className="result-analysis-title">Question Breakdown</h3>
          {result.answers.map((answer, index) => {
            // Try to get question details from populated quiz
            const question = result.quizId?.questions
              ? result.quizId.questions.find(q => q._id === answer.questionId)
              : null;

            return (
              <div
                key={index}
                className={`result-analysis-item ${answer.isCorrect ? 'correct' : 'wrong'}`}
              >
                <div className="result-analysis-header">
                  <span className={`result-analysis-badge ${answer.isCorrect ? 'badge-success' : 'badge-error'}`}>
                    {answer.isCorrect ? '✓' : '✗'} Q{index + 1}
                  </span>
                  <span className="result-analysis-status">
                    {answer.isCorrect ? 'Correct' : 'Incorrect'}
                  </span>
                </div>
                {question && (
                  <p className="result-analysis-question">{question.questionText}</p>
                )}
              </div>
            );
          })}
        </div>
      )}

      <div style={{ height: '80px' }} />
      <Navbar />
    </div>
  );
};

export default ResultPage;
