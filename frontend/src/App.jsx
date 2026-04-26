import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/common/ProtectedRoute';
import ErrorBoundary from './components/common/ErrorBoundary';
import NotFound from './pages/NotFound';

// Pages
import Splash from './pages/Splash';
import Login from './pages/Login';
import Register from './pages/Register';

// Student Pages
import Dashboard from './pages/student/Dashboard';
import QuizPage from './pages/student/QuizPage';
import ResultPage from './pages/student/ResultPage';
import ProgressPage from './pages/student/ProgressPage';
import ProfilePage from './pages/student/ProfilePage';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import ManageQuizzes from './pages/admin/ManageQuizzes';
import CreateQuiz from './pages/admin/CreateQuiz';
import EditQuiz from './pages/admin/EditQuiz';
import ManageUsers from './pages/admin/ManageUsers';

function App() {
  return (
    <ErrorBoundary>
    <Router>
      <AuthProvider>
        {/* Toast notifications */}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: '#12122A',
              color: '#FFFFFF',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '12px',
              fontFamily: "'Inter', sans-serif",
              fontSize: '0.875rem',
            },
            success: {
              iconTheme: {
                primary: '#4CAF50',
                secondary: '#FFFFFF',
              },
            },
            error: {
              iconTheme: {
                primary: '#FF5252',
                secondary: '#FFFFFF',
              },
            },
          }}
        />

        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Splash />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Student Routes */}
          <Route
            path="/student/dashboard"
            element={
              <ProtectedRoute role="student">
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/quiz/:id"
            element={
              <ProtectedRoute role="student">
                <QuizPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/result/:id"
            element={
              <ProtectedRoute role="student">
                <ResultPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/progress"
            element={
              <ProtectedRoute role="student">
                <ProgressPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/student/profile"
            element={
              <ProtectedRoute role="student">
                <ProfilePage />
              </ProtectedRoute>
            }
          />

          {/* Admin Routes */}
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute role="admin">
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/quizzes"
            element={
              <ProtectedRoute role="admin">
                <ManageQuizzes />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/quizzes/create"
            element={
              <ProtectedRoute role="admin">
                <CreateQuiz />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/quizzes/edit/:id"
            element={
              <ProtectedRoute role="admin">
                <EditQuiz />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/users"
            element={
              <ProtectedRoute role="admin">
                <ManageUsers />
              </ProtectedRoute>
            }
          />

          {/* 404 — Not Found */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AuthProvider>
    </Router>
    </ErrorBoundary>
  );
}

export default App;
