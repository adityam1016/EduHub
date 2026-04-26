import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../../api/axios';
import Sidebar from '../../components/common/Sidebar';
import StatCard from '../../components/common/StatCard';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({ users: 0, quizzes: 0, results: 0, avgScore: 0 });
  const [recentResults, setRecentResults] = useState([]);
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [usersRes, quizzesRes, resultsRes] = await Promise.all([
        API.get('/users'),
        API.get('/quizzes'),
        API.get('/results/all'),
      ]);

      const users = usersRes.data;
      const quizzesList = quizzesRes.data;
      const results = resultsRes.data;

      const avgScore = results.length > 0
        ? Math.round(results.reduce((a, r) => a + r.percentage, 0) / results.length)
        : 0;

      setStats({
        users: users.length,
        quizzes: quizzesList.length,
        results: results.length,
        avgScore,
      });

      setQuizzes(quizzesList);
      setRecentResults(results.slice(0, 8));
    } catch (error) {
      console.error('Admin dashboard error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <>
        <Sidebar />
        <div className="admin-layout">
          <div className="loading-overlay" style={{ position: 'relative', minHeight: '60vh' }}>
            <div className="spinner-gradient" style={{ width: '48px', height: '48px' }}></div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Sidebar />
      <div className="admin-layout">
        <div className="admin-page-header">
          <div>
            <h1 className="admin-page-title">Dashboard</h1>
            <p className="admin-page-subtitle">Overview of your platform</p>
          </div>
          <button className="btn btn-primary" onClick={() => navigate('/admin/quizzes/create')}>
            + Create Quiz
          </button>
        </div>

        {/* Stats */}
        <div className="admin-stats-row">
          <StatCard label="Total Users" value={stats.users} icon="👥" color="var(--accent-blue)" />
          <StatCard label="Total Quizzes" value={stats.quizzes} icon="📝" color="var(--accent-purple)" />
          <StatCard label="Attempts" value={stats.results} icon="📊" color="var(--color-success)" />
          <StatCard label="Avg Score" value={stats.avgScore} suffix="%" icon="⭐" color="var(--color-warning)" />
        </div>

        {/* Two column layout */}
        <div className="admin-grid-2col">
          {/* Recent Activity */}
          <div className="admin-card">
            <div className="admin-card-header">
              <h3>Recent Activity</h3>
              <span className="badge badge-purple">{recentResults.length} results</span>
            </div>
            <div className="admin-activity-list">
              {recentResults.length === 0 ? (
                <p className="admin-empty-text">No quiz attempts yet</p>
              ) : (
                recentResults.map((r) => (
                  <div key={r._id} className="admin-activity-item">
                    <div className="admin-activity-left">
                      <div className="admin-activity-avatar">
                        {r.userId?.name?.charAt(0).toUpperCase() || '?'}
                      </div>
                      <div>
                        <p className="admin-activity-name">{r.userId?.name || 'Unknown'}</p>
                        <p className="admin-activity-quiz">{r.quizTitle}</p>
                      </div>
                    </div>
                    <span className={`pill ${r.percentage >= 70 ? 'pill-success' : r.percentage >= 50 ? 'pill-warning' : 'pill-error'}`}>
                      {r.percentage}%
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Quiz Overview */}
          <div className="admin-card">
            <div className="admin-card-header">
              <h3>Quizzes</h3>
              <button className="btn btn-ghost btn-sm" onClick={() => navigate('/admin/quizzes')}>
                View All →
              </button>
            </div>
            <div className="admin-quiz-list">
              {quizzes.length === 0 ? (
                <p className="admin-empty-text">No quizzes created yet</p>
              ) : (
                quizzes.slice(0, 6).map((q) => (
                  <div key={q._id} className="admin-quiz-row">
                    <div className="admin-quiz-row-left">
                      <h4 className="admin-quiz-row-title">{q.title}</h4>
                      <p className="admin-quiz-row-meta">
                        {q.questions?.length || 0} questions · {q.difficulty}
                      </p>
                    </div>
                    <span className={`pill ${q.isPublished ? 'pill-success' : 'pill-warning'}`}>
                      {q.isPublished ? 'Published' : 'Draft'}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminDashboard;
