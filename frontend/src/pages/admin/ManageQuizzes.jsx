import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../../api/axios';
import toast from 'react-hot-toast';
import Sidebar from '../../components/common/Sidebar';
import './ManageQuizzes.css';

const difficultyColors = {
  Easy: 'var(--color-success)',
  Medium: 'var(--color-warning)',
  Hard: 'var(--color-error)',
};

const ManageQuizzes = () => {
  const navigate = useNavigate();
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchQuizzes();
  }, []);

  const fetchQuizzes = async () => {
    try {
      const { data } = await API.get('/quizzes');
      setQuizzes(data);
    } catch (error) {
      toast.error('Failed to load quizzes');
    } finally {
      setLoading(false);
    }
  };

  const handleTogglePublish = async (id) => {
    try {
      const { data } = await API.patch(`/quizzes/${id}/publish`);
      toast.success(data.message);
      setQuizzes(prev =>
        prev.map(q => q._id === id ? { ...q, isPublished: data.isPublished } : q)
      );
    } catch (error) {
      toast.error('Failed to toggle publish status');
    }
  };

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Delete "${title}"? This cannot be undone.`)) return;
    try {
      await API.delete(`/quizzes/${id}`);
      toast.success('Quiz deleted');
      setQuizzes(prev => prev.filter(q => q._id !== id));
    } catch (error) {
      toast.error('Failed to delete quiz');
    }
  };

  return (
    <>
      <Sidebar />
      <div className="admin-layout">
        <div className="admin-page-header">
          <div>
            <h1 className="admin-page-title">Manage Quizzes</h1>
            <p className="admin-page-subtitle">{quizzes.length} quizzes total</p>
          </div>
          <button className="btn btn-primary" onClick={() => navigate('/admin/quizzes/create')}>
            + Create Quiz
          </button>
        </div>

        {loading ? (
          <div className="loading-overlay" style={{ position: 'relative', minHeight: '40vh' }}>
            <div className="spinner-gradient" style={{ width: '48px', height: '48px' }}></div>
          </div>
        ) : quizzes.length === 0 ? (
          <div className="manage-empty">
            <h3>No quizzes yet</h3>
            <p>Create your first quiz to get started</p>
            <button className="btn btn-primary" onClick={() => navigate('/admin/quizzes/create')}>
              + Create Quiz
            </button>
          </div>
        ) : (
          <div className="manage-quiz-grid">
            {quizzes.map((quiz) => (
              <div key={quiz._id} className="manage-quiz-card">
                <div className="manage-quiz-card-top">
                  <div className="manage-quiz-card-header">
                    <h3 className="manage-quiz-card-title">{quiz.title}</h3>
                    <span
                      className="badge"
                      style={{
                        background: `${difficultyColors[quiz.difficulty]}20`,
                        color: difficultyColors[quiz.difficulty],
                      }}
                    >
                      {quiz.difficulty}
                    </span>
                  </div>
                  {quiz.description && (
                    <p className="manage-quiz-card-desc">{quiz.description}</p>
                  )}
                  <div className="manage-quiz-card-meta">
                    <span>{quiz.questions?.length || 0} questions</span>
                    <span>·</span>
                    <span>{Math.floor((quiz.timeLimit || 600) / 60)} min</span>
                    <span>·</span>
                    <span>{quiz.category}</span>
                  </div>
                </div>

                <div className="manage-quiz-card-actions">
                  {/* Publish toggle */}
                  <button
                    className={`btn btn-sm ${quiz.isPublished ? 'btn-success-ghost' : 'btn-warning-ghost'}`}
                    onClick={() => handleTogglePublish(quiz._id)}
                  >
                    {quiz.isPublished ? '✓ Published' : '◯ Draft'}
                  </button>

                  <div className="manage-quiz-card-btns">
                    <button
                      className="btn btn-ghost btn-sm"
                      onClick={() => navigate(`/admin/quizzes/edit/${quiz._id}`)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-ghost btn-sm manage-delete-btn"
                      onClick={() => handleDelete(quiz._id, quiz.title)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default ManageQuizzes;
