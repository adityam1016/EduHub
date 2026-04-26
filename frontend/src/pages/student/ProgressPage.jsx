import { useState, useEffect } from 'react';
import API from '../../api/axios';
import Navbar from '../../components/common/Navbar';
import StatCard from '../../components/common/StatCard';
import ProgressChart from '../../components/common/ProgressChart';
import ActivityItem from '../../components/student/ActivityItem';
import './ProgressPage.css';

const ProgressPage = () => {
  const [stats, setStats] = useState({ totalQuizzes: 0, avgScore: 0, bestStreak: 0, last7Days: [] });
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, resultsRes] = await Promise.all([
          API.get('/results/stats'),
          API.get('/results/mine'),
        ]);
        setStats(statsRes.data);
        setResults(resultsRes.data);
      } catch (error) {
        console.error('Progress data error:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Find highest score
  const highScore = results.length > 0
    ? Math.max(...results.map(r => r.percentage))
    : 0;

  if (loading) {
    return (
      <div className="loading-overlay">
        <div className="spinner-gradient" style={{ width: '48px', height: '48px' }}></div>
      </div>
    );
  }

  return (
    <div className="progress-page">
      <h1 className="progress-title">Your Progress 📊</h1>
      <p className="progress-subtitle">Consistency builds mastery</p>

      {/* Performance Chart */}
      <div className="progress-chart-card card-static">
        <h3 className="progress-chart-heading">Weekly Performance</h3>
        <ProgressChart data={stats.last7Days} color="#7B5EA7" height={220} />
      </div>

      {/* Stats Row */}
      <div className="progress-stats">
        <StatCard label="Total" value={stats.totalQuizzes} icon="📝" color="var(--accent-blue)" />
        <StatCard label="High" value={highScore} suffix="%" icon="🏆" color="var(--color-warning)" />
        <StatCard label="Avg" value={stats.avgScore} suffix="%" icon="📊" color="var(--accent-purple)" />
      </div>

      {/* Recent Activity */}
      <div className="progress-activity-section">
        <h2 className="progress-section-title">RECENT ACTIVITY</h2>

        {results.length === 0 ? (
          <div className="progress-empty">
            <p>No quiz attempts yet. Start your first quiz!</p>
          </div>
        ) : (
          <div className="progress-activity-list">
            {results.map((result) => (
              <ActivityItem
                key={result._id}
                title={result.quizTitle || 'Quiz'}
                date={result.completedAt}
                score={result.correctAnswers}
                total={result.totalQuestions}
                percentage={result.percentage}
                category={result.quizId?.category}
              />
            ))}
          </div>
        )}
      </div>

      <div style={{ height: '80px' }} />
      <Navbar />
    </div>
  );
};

export default ProgressPage;
