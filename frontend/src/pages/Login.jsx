import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Auth.css';

const Login = () => {
  const { login } = useAuth();
  const [selectedRole, setSelectedRole] = useState('student');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    if (!email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = 'Invalid email format';
    if (!password) newErrors.password = 'Password is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      await login(email, password, selectedRole);
    } catch {
      // Error handled in AuthContext
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        {/* Logo */}
        <div className="auth-logo">
          <div className="auth-logo-icon">
            <svg width="24" height="24" viewBox="0 0 40 40" fill="none">
              <path d="M20 4L36 12V28L20 36L4 28V12L20 4Z" fill="url(#loginGrad)" opacity="0.9"/>
              <path d="M20 8L30 13V27L20 32L10 27V13L20 8Z" fill="#12122A"/>
              <path d="M20 12L26 15V25L20 28L14 25V15L20 12Z" fill="url(#loginGrad)"/>
              <defs>
                <linearGradient id="loginGrad" x1="4" y1="4" x2="36" y2="36">
                  <stop offset="0%" stopColor="#7B5EA7"/>
                  <stop offset="100%" stopColor="#4A90D9"/>
                </linearGradient>
              </defs>
            </svg>
          </div>
          <span className="auth-logo-text">EDUHUB</span>
        </div>

        {/* Heading */}
        <h1 className="auth-title">Welcome Back</h1>
        <p className="auth-subtitle">Ready to level up?</p>

        {/* Role Tabs */}
        <div className="auth-role-tabs">
          <button
            type="button"
            className={`auth-role-tab ${selectedRole === 'student' ? 'active' : ''}`}
            onClick={() => setSelectedRole('student')}
          >
            🎓 Student
          </button>
          <button
            type="button"
            className={`auth-role-tab ${selectedRole === 'admin' ? 'active' : ''}`}
            onClick={() => setSelectedRole('admin')}
          >
            🛡️ Admin
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="auth-form">
          {/* Email */}
          <div className="input-group">
            <label htmlFor="login-email">Email Address</label>
            <div className="input-wrapper">
              <input
                id="login-email"
                type="email"
                className={errors.email ? 'input-error' : ''}
                placeholder={selectedRole === 'admin' ? 'admin@eduhub.com' : 'you@example.com'}
                value={email}
                onChange={(e) => { setEmail(e.target.value); setErrors(prev => ({...prev, email: ''})); }}
              />
            </div>
            {errors.email && <span className="error-text">{errors.email}</span>}
          </div>

          {/* Password */}
          <div className="input-group">
            <label htmlFor="login-password">Password</label>
            <div className="input-wrapper">
              <input
                id="login-password"
                type={showPassword ? 'text' : 'password'}
                className={`input-with-icon-right ${errors.password ? 'input-error' : ''}`}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => { setPassword(e.target.value); setErrors(prev => ({...prev, password: ''})); }}
              />
              <span
                className="input-icon-right"
                onClick={() => setShowPassword(!showPassword)}
                role="button"
                tabIndex={0}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94"/>
                    <path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19"/>
                    <line x1="1" y1="1" x2="23" y2="23"/>
                  </svg>
                ) : (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                    <circle cx="12" cy="12" r="3"/>
                  </svg>
                )}
              </span>
            </div>
            {errors.password && <span className="error-text">{errors.password}</span>}
          </div>

          {/* Forgot password */}
          <div className="auth-forgot">
            <a href="#" className="auth-link-blue">Forgot Password?</a>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="btn btn-primary btn-lg btn-full"
            disabled={loading}
            id="login-submit"
          >
            {loading ? (
              <div className="spinner-sm" style={{ width: '20px', height: '20px', borderWidth: '2px' }}></div>
            ) : (
              `Login as ${selectedRole === 'admin' ? 'Admin' : 'Student'}`
            )}
          </button>
        </form>


        {/* Register link */}
        <p className="auth-footer">
          New here?{' '}
          <Link to="/register" className="gradient-text auth-link-gradient">
            Create Account
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
