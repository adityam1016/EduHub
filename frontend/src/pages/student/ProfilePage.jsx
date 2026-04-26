import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import API from '../../api/axios';
import Navbar from '../../components/common/Navbar';
import { useConfirmDialog } from '../../components/common/ConfirmDialog';
import './ProfilePage.css';

const ProfilePage = () => {
  const { user, logout } = useAuth();
  const [stats, setStats] = useState({ totalQuizzes: 0, avgScore: 0, bestStreak: 0 });
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const { confirm, dialog } = useConfirmDialog();

  const handleLogout = async () => {
    const ok = await confirm({
      title: 'Logout',
      message: 'Are you sure you want to log out of your account?',
      confirmText: 'Logout',
      variant: 'danger',
    });
    if (ok) logout();
  };

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
        console.error('Profile data error:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Find best quiz
  const bestQuiz = results.length > 0
    ? results.reduce((best, r) => r.percentage > (best?.percentage || 0) ? r : best, null)
    : null;

  // Member since
  const memberSince = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
    : 'Recently joined';

  // Get initials
  const initials = user?.name
    ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : 'S';

  return (
    <div className="profile-page">
      {/* Header with gradient background */}
      <div className="profile-header">
        <div className="profile-avatar-container">
          <div className="profile-avatar-ring">
            <div className="profile-avatar-inner">
              {initials}
            </div>
          </div>
          <div className="profile-badge">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
          </div>
        </div>

        <h1 className="profile-name">{user?.name || 'Student'}</h1>
        <p className="profile-email">{user?.email || ''}</p>
        <span className="profile-role-badge">
          {user?.role === 'admin' ? '🛡️ Admin' : '🎓 Student'}
        </span>
      </div>

      {/* Stats Grid */}
      <div className="profile-stats-grid">
        <div className="profile-stat-item">
          <div className="profile-stat-value">{stats.totalQuizzes}</div>
          <div className="profile-stat-label">Quizzes Taken</div>
        </div>
        <div className="profile-stat-item">
          <div className="profile-stat-value">{stats.avgScore}%</div>
          <div className="profile-stat-label">Average Score</div>
        </div>
        <div className="profile-stat-item">
          <div className="profile-stat-value">{stats.bestStreak}</div>
          <div className="profile-stat-label">Best Streak</div>
        </div>
        <div className="profile-stat-item">
          <div className="profile-stat-value">{bestQuiz ? `${bestQuiz.percentage}%` : '—'}</div>
          <div className="profile-stat-label">Best Score</div>
        </div>
      </div>

      {/* Info Cards */}
      <div className="profile-info-section">
        <div className="profile-info-card">
          <div className="profile-info-row">
            <div className="profile-info-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/>
                <circle cx="12" cy="7" r="4"/>
              </svg>
            </div>
            <div className="profile-info-content">
              <p className="profile-info-label">Full Name</p>
              <p className="profile-info-value">{user?.name || 'Student'}</p>
            </div>
          </div>

          <div className="profile-info-row">
            <div className="profile-info-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="4" width="20" height="16" rx="2"/>
                <path d="M22 4L12 13L2 4"/>
              </svg>
            </div>
            <div className="profile-info-content">
              <p className="profile-info-label">Email Address</p>
              <p className="profile-info-value">{user?.email || ''}</p>
            </div>
          </div>

          <div className="profile-info-row">
            <div className="profile-info-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                <line x1="16" y1="2" x2="16" y2="6"/>
                <line x1="8" y1="2" x2="8" y2="6"/>
                <line x1="3" y1="10" x2="21" y2="10"/>
              </svg>
            </div>
            <div className="profile-info-content">
              <p className="profile-info-label">Member Since</p>
              <p className="profile-info-value">{memberSince}</p>
            </div>
          </div>

          <div className="profile-info-row">
            <div className="profile-info-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
              </svg>
            </div>
            <div className="profile-info-content">
              <p className="profile-info-label">Account Type</p>
              <p className="profile-info-value" style={{ textTransform: 'capitalize' }}>{user?.role || 'student'}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Best Performance */}
      {bestQuiz && (
        <div className="profile-best-section">
          <h3 className="profile-section-title">🏆 Best Performance</h3>
          <div className="profile-best-card">
            <div className="profile-best-left">
              <h4 className="profile-best-quiz">{bestQuiz.quizTitle}</h4>
              <p className="profile-best-date">
                {new Date(bestQuiz.completedAt).toLocaleDateString('en-US', {
                  month: 'short', day: 'numeric', year: 'numeric'
                })}
              </p>
            </div>
            <div className="profile-best-score">
              <span className="profile-best-percent">{bestQuiz.percentage}%</span>
              <span className="profile-best-ratio">{bestQuiz.correctAnswers}/{bestQuiz.totalQuestions}</span>
            </div>
          </div>
        </div>
      )}

      {/* Logout Button */}
      <button className="btn btn-danger btn-full profile-logout-btn" onClick={handleLogout}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/>
          <polyline points="16 17 21 12 16 7"/>
          <line x1="21" y1="12" x2="9" y2="12"/>
        </svg>
        Logout
      </button>

      {dialog}
      <div style={{ height: '80px' }} />
      <Navbar />
    </div>
  );
};

export default ProfilePage;
