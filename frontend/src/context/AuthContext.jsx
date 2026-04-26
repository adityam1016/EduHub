import { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/axios';
import toast from 'react-hot-toast';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // On mount: restore user & token from localStorage
  useEffect(() => {
    const storedToken = localStorage.getItem('eduhub_token');
    const storedUser = localStorage.getItem('eduhub_user');

    if (storedToken && storedUser) {
      try {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
      } catch {
        // Invalid stored data — clear it
        localStorage.removeItem('eduhub_token');
        localStorage.removeItem('eduhub_user');
      }
    }

    setLoading(false);
  }, []);

  /**
   * Login with email and password
   */
  const login = async (email, password, role) => {
    try {
      const { data } = await API.post('/auth/login', { email, password, role });

      // Store in localStorage
      localStorage.setItem('eduhub_token', data.token);
      localStorage.setItem('eduhub_user', JSON.stringify(data.user));

      // Update state
      setToken(data.token);
      setUser(data.user);

      toast.success(`Welcome back, ${data.user.name}!`);

      // Redirect based on role
      if (data.user.role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/student/dashboard');
      }

      return data;
    } catch (error) {
      const message = error.response?.data?.message || 'Login failed';
      toast.error(message);
      throw error;
    }
  };

  /**
   * Register a new account
   */
  const register = async (name, email, password, role = 'student') => {
    try {
      const { data } = await API.post('/auth/register', { name, email, password, role });

      // Store in localStorage
      localStorage.setItem('eduhub_token', data.token);
      localStorage.setItem('eduhub_user', JSON.stringify(data.user));

      // Update state
      setToken(data.token);
      setUser(data.user);

      toast.success('Account created successfully!');

      // Redirect based on role
      if (data.user.role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/student/dashboard');
      }

      return data;
    } catch (error) {
      const message = error.response?.data?.message || 'Registration failed';
      toast.error(message);
      throw error;
    }
  };

  /**
   * Logout — clear everything and redirect to /login
   */
  const logout = () => {
    localStorage.removeItem('eduhub_token');
    localStorage.removeItem('eduhub_user');
    setToken(null);
    setUser(null);
    toast.success('Logged out successfully');
    navigate('/login');
  };

  // Derived state
  const isAdmin = user?.role === 'admin';
  const isAuthenticated = !!token && !!user;

  const value = {
    user,
    token,
    loading,
    login,
    register,
    logout,
    isAdmin,
    isAuthenticated,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
