import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Splash.css';

const Splash = () => {
  const navigate = useNavigate();
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Animate progress bar from 0 to 100 over 2.5 seconds
    const duration = 2500;
    const interval = 20;
    const steps = duration / interval;
    const increment = 100 / steps;
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= 100) {
        current = 100;
        clearInterval(timer);
      }
      setProgress(current);
    }, interval);

    // Navigate to login after animation
    const navTimer = setTimeout(() => {
      navigate('/login');
    }, 2800);

    return () => {
      clearInterval(timer);
      clearTimeout(navTimer);
    };
  }, [navigate]);

  return (
    <div className="splash-container">
      {/* Glowing logo */}
      <div className="splash-logo-wrapper">
        <div className="splash-logo">
          <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
            <path d="M20 4L36 12V28L20 36L4 28V12L20 4Z" fill="url(#grad)" opacity="0.9"/>
            <path d="M20 8L30 13V27L20 32L10 27V13L20 8Z" fill="#0D0D1A"/>
            <path d="M20 12L26 15V25L20 28L14 25V15L20 12Z" fill="url(#grad)"/>
            <defs>
              <linearGradient id="grad" x1="4" y1="4" x2="36" y2="36">
                <stop offset="0%" stopColor="#7B5EA7"/>
                <stop offset="100%" stopColor="#4A90D9"/>
              </linearGradient>
            </defs>
          </svg>
        </div>
      </div>

      {/* Brand name */}
      <h1 className="splash-title">EDUHUB</h1>

      {/* Tagline */}
      <p className="splash-tagline">TEST. COMPETE. LEVEL UP.</p>

      {/* Progress bar */}
      <div className="splash-progress">
        <div
          className="splash-progress-fill"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
    </div>
  );
};

export default Splash;
