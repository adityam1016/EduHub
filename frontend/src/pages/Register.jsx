import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Auth.css';

const Register = () => {
  const { register } = useAuth();
  const [selectedRole, setSelectedRole] = useState('student');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (field) => (e) => {
    setFormData(prev => ({ ...prev, [field]: e.target.value }));
    setErrors(prev => ({ ...prev, [field]: '' }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Invalid email format';
    if (!formData.password) newErrors.password = 'Password is required';
    else if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    if (!formData.confirmPassword) newErrors.confirmPassword = 'Please confirm your password';
    else if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      await register(formData.name, formData.email, formData.password, selectedRole);
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
              <path d="M20 4L36 12V28L20 36L4 28V12L20 4Z" fill="url(#regGrad)" opacity="0.9"/>
              <path d="M20 8L30 13V27L20 32L10 27V13L20 8Z" fill="#12122A"/>
              <path d="M20 12L26 15V25L20 28L14 25V15L20 12Z" fill="url(#regGrad)"/>
              <defs>
                <linearGradient id="regGrad" x1="4" y1="4" x2="36" y2="36">
                  <stop offset="0%" stopColor="#7B5EA7"/>
                  <stop offset="100%" stopColor="#4A90D9"/>
                </linearGradient>
              </defs>
            </svg>
          </div>
          <span className="auth-logo-text">EDUHUB</span>
        </div>

        {/* Heading */}
        <h1 className="auth-title">Create Account</h1>
        <p className="auth-subtitle">Join the learning revolution</p>

        {/* Role Selector */}
        <div className="auth-role-selector">
          <button
            type="button"
            className={`auth-role-btn ${selectedRole === 'student' ? 'active' : ''}`}
            onClick={() => setSelectedRole('student')}
          >
            <span className="auth-role-icon">🎓</span>
            <span className="auth-role-label">Student</span>
            <span className="auth-role-desc">Take quizzes & learn</span>
          </button>
          <button
            type="button"
            className={`auth-role-btn ${selectedRole === 'admin' ? 'active' : ''}`}
            onClick={() => setSelectedRole('admin')}
          >
            <span className="auth-role-icon">🛡️</span>
            <span className="auth-role-label">Admin</span>
            <span className="auth-role-desc">Create & manage quizzes</span>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="auth-form">
          {/* Full Name */}
          <div className="input-group">
            <label htmlFor="register-name">Full Name</label>
            <div className="input-wrapper">
              <input
                id="register-name"
                type="text"
                className={errors.name ? 'input-error' : ''}
                placeholder="John Doe"
                value={formData.name}
                onChange={handleChange('name')}
              />
            </div>
            {errors.name && <span className="error-text">{errors.name}</span>}
          </div>

          {/* Email */}
          <div className="input-group">
            <label htmlFor="register-email">Email Address</label>
            <div className="input-wrapper">
              <input
                id="register-email"
                type="email"
                className={errors.email ? 'input-error' : ''}
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleChange('email')}
              />
            </div>
            {errors.email && <span className="error-text">{errors.email}</span>}
          </div>

          {/* Password */}
          <div className="input-group">
            <label htmlFor="register-password">Password</label>
            <div className="input-wrapper">
              <input
                id="register-password"
                type={showPassword ? 'text' : 'password'}
                className={`input-with-icon-right ${errors.password ? 'input-error' : ''}`}
                placeholder="At least 6 characters"
                value={formData.password}
                onChange={handleChange('password')}
              />
              <span className="input-icon-right" onClick={() => setShowPassword(!showPassword)} role="button" tabIndex={0}>
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

          {/* Confirm Password */}
          <div className="input-group">
            <label htmlFor="register-confirm">Confirm Password</label>
            <div className="input-wrapper">
              <input
                id="register-confirm"
                type={showConfirm ? 'text' : 'password'}
                className={`input-with-icon-right ${errors.confirmPassword ? 'input-error' : ''}`}
                placeholder="Repeat your password"
                value={formData.confirmPassword}
                onChange={handleChange('confirmPassword')}
              />
              <span className="input-icon-right" onClick={() => setShowConfirm(!showConfirm)} role="button" tabIndex={0}>
                {showConfirm ? (
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
            {errors.confirmPassword && <span className="error-text">{errors.confirmPassword}</span>}
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="btn btn-primary btn-lg btn-full"
            disabled={loading}
            id="register-submit"
          >
            {loading ? (
              <div className="spinner-sm" style={{ width: '20px', height: '20px', borderWidth: '2px' }}></div>
            ) : (
              `Create ${selectedRole === 'admin' ? 'Admin' : 'Student'} Account`
            )}
          </button>
        </form>

        {/* Login link */}
        <p className="auth-footer" style={{ marginTop: '24px' }}>
          Already have an account?{' '}
          <Link to="/login" className="gradient-text auth-link-gradient">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
