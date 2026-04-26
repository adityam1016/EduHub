import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import API from '../../api/axios';
import Navbar from '../../components/common/Navbar';
import StatCard from '../../components/common/StatCard';
import ProgressChart from '../../components/common/ProgressChart';
import QuizCard from '../../components/student/QuizCard';
import './Dashboard.css';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({ totalQuizzes: 0, avgScore: 0, bestStreak: 0, last7Days: [] });
  const [results, setResults] = useState([]);
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [statsRes, resultsRes, quizzesRes] = await Promise.all([
        API.get('/results/stats'),
        API.get('/results/mine'),
        API.get('/quizzes'),
      ]);
      setStats(statsRes.data);
      setResults(resultsRes.data);
      setQuizzes(quizzesRes.data);
    } catch (error) {
      console.error('Dashboard data error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Calculate % change from last 7 days
  const getPercentChange = () => {
    if (!stats.last7Days || stats.last7Days.length < 2) return null;
    const scores = stats.last7Days.filter(d => d.score > 0);
    if (scores.length < 2) return null;
    const last = scores[scores.length - 1].score;
    const prev = scores[scores.length - 2].score;
    if (prev === 0) return null;
    return Math.round(((last - prev) / prev) * 100);
  };

  const percentChange = getPercentChange();

  if (loading) {
    return (
      <div className="loading-overlay">
        <div className="spinner-gradient" style={{ width: '48px', height: '48px' }}></div>
      </div>
    );
  }

  return (
    <div className="dashboard-page">
      {/* Top Bar */}
      <div className="dashboard-header">
        <div>
          <h1 className="dashboard-greeting">Hey, {user?.name || 'Student'} 👋</h1>
          <p className="dashboard-subtext">Ready to beat your high score?</p>
        </div>
        <div className="dashboard-avatar">
          {user?.name?.charAt(0).toUpperCase() || 'S'}
        </div>
      </div>

      {/* Stats Row */}
      <div className="dashboard-stats">
        <StatCard label="Quizzes" value={stats.totalQuizzes} icon="📝" color="var(--accent-blue)" />
        <StatCard label="Avg Score" value={stats.avgScore} suffix="%" icon="📊" color="var(--accent-purple)" />
        <StatCard label="Streak" value={stats.bestStreak} suffix=" 🔥" icon="" color="var(--color-warning)" />
      </div>

      {/* Progress Chart */}
      <div className="dashboard-section">
        <div className="dashboard-section-header">
          <h2 className="dashboard-section-title">Your Progress</h2>
          {percentChange !== null && (
            <span className={`badge ${percentChange >= 0 ? 'badge-success' : 'badge-error'}`}>
              {percentChange >= 0 ? '+' : ''}{percentChange}%
            </span>
          )}
        </div>
        <div className="card-static">
          <ProgressChart data={stats.last7Days} color="#7B5EA7" height={180} />
        </div>
      </div>

      {/* Start New Quiz CTA */}
      <div className="dashboard-cta" onClick={() => {
        if (quizzes.length > 0) {
          navigate(`/student/quiz/${quizzes[0]._id}`);
        }
      }}>
        <div className="dashboard-cta-text">
          <h3>Start New Quiz</h3>
          <p>Ready for your daily challenge!</p>
        </div>
        <div className="dashboard-cta-play">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="5 3 19 12 5 21 5 3"/>
          </svg>
        </div>
      </div>

      {/* Available Quizzes */}
      {quizzes.length > 0 && (
        <div className="dashboard-section">
          <h2 className="dashboard-section-title">Available Quizzes</h2>
          <div className="dashboard-quizzes-grid">
            {quizzes.map((quiz) => (
              <QuizCard key={quiz._id} quiz={quiz} />
            ))}
          </div>
        </div>
      )}

      {/* Score History */}
      {results.length > 0 && (
        <div className="dashboard-section">
          <div className="dashboard-section-header">
            <h2 className="dashboard-section-title">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: 6, verticalAlign: 'middle' }}>
                <circle cx="12" cy="12" r="10"/>
                <polyline points="12 6 12 12 16 14"/>
              </svg>
              Score History
            </h2>
          </div>
          <div className="dashboard-history">
            {results.slice(0, 5).map((result) => (
              <QuizCard key={result._id} quiz={result} variant="history" />
            ))}
          </div>
        </div>
      )}

      {/* Bottom spacing for navbar */}
      <div style={{ height: '80px' }} />

      <Navbar />
    </div>
  );
};

export default Dashboard;
