import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

/**
 * ProtectedRoute component
 * - If not authenticated → redirect to /login
 * - If wrong role → redirect to their own dashboard
 * - If loading → show loading spinner
 *
 * Props:
 *   role: 'student' | 'admin' — required role to access
 *   children: the protected page content
 */
const ProtectedRoute = ({ role, children }) => {
  const { user, loading, isAuthenticated } = useAuth();

  // Show loading spinner while checking auth state
  if (loading) {
    return (
      <div className="loading-overlay">
        <div className="spinner-gradient" style={{ width: '48px', height: '48px' }}></div>
      </div>
    );
  }

  // Not authenticated → redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Wrong role → redirect to their own dashboard
  if (role && user.role !== role) {
    if (user.role === 'admin') {
      return <Navigate to="/admin/dashboard" replace />;
    }
    return <Navigate to="/student/dashboard" replace />;
  }

  return children;
};

export default ProtectedRoute;
