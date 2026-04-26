import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './NotFound.css';

const NotFound = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleGoHome = () => {
    if (user?.role === 'admin') {
      navigate('/admin/dashboard');
    } else if (user) {
      navigate('/student/dashboard');
    } else {
      navigate('/login');
    }
  };

  return (
    <div className="notfound-page">
      <div className="notfound-content">
        {/* Animated 404 */}
        <div className="notfound-number">
          <span className="notfound-4">4</span>
          <div className="notfound-circle">
            <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
              <circle cx="40" cy="40" r="36" stroke="url(#nfGrad)" strokeWidth="4" strokeDasharray="8 6" opacity="0.6">
                <animateTransform attributeName="transform" type="rotate" from="0 40 40" to="360 40 40" dur="20s" repeatCount="indefinite"/>
              </circle>
              <circle cx="40" cy="40" r="24" fill="url(#nfGrad)" opacity="0.15"/>
              <text x="40" y="48" textAnchor="middle" fill="url(#nfGrad)" fontSize="28" fontWeight="800" fontFamily="Inter, sans-serif">?</text>
              <defs>
                <linearGradient id="nfGrad" x1="0" y1="0" x2="80" y2="80">
                  <stop offset="0%" stopColor="#7B5EA7"/>
                  <stop offset="100%" stopColor="#4A90D9"/>
                </linearGradient>
              </defs>
            </svg>
          </div>
          <span className="notfound-4">4</span>
        </div>

        <h1 className="notfound-title">Page Not Found</h1>
        <p className="notfound-text">
          The page you're looking for doesn't exist or has been moved.
        </p>

        <div className="notfound-actions">
          <button className="btn btn-primary btn-lg" onClick={handleGoHome}>
            Go to Dashboard
          </button>
          <button className="btn btn-ghost" onClick={() => navigate(-1)}>
            ← Go Back
          </button>
        </div>
      </div>

      {/* Floating particles */}
      <div className="notfound-particles">
        {[...Array(6)].map((_, i) => (
          <div key={i} className={`notfound-particle particle-${i + 1}`} />
        ))}
      </div>
    </div>
  );
};

export default NotFound;
