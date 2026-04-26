import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../../api/axios';
import toast from 'react-hot-toast';
import Sidebar from '../../components/common/Sidebar';
import './QuizForm.css';

const emptyQuestion = () => ({
  questionText: '',
  options: [
    { text: '', isCorrect: true },
    { text: '', isCorrect: false },
    { text: '', isCorrect: false },
    { text: '', isCorrect: false },
  ],
  points: 10,
  explanation: '',
});

const CreateQuiz = () => {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    title: '',
    description: '',
    category: '',
    difficulty: 'Medium',
    timeLimit: 600,
    isPublished: false,
  });
  const [questions, setQuestions] = useState([emptyQuestion()]);

  const updateForm = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const updateQuestion = (qi, field, value) => {
    setQuestions(prev => {
      const copy = [...prev];
      copy[qi] = { ...copy[qi], [field]: value };
      return copy;
    });
  };

  const updateOption = (qi, oi, field, value) => {
    setQuestions(prev => {
      const copy = [...prev];
      const options = [...copy[qi].options];

      if (field === 'isCorrect' && value === true) {
        // Only one correct answer per question
        options.forEach((o, i) => { options[i] = { ...o, isCorrect: i === oi }; });
      } else {
        options[oi] = { ...options[oi], [field]: value };
      }

      copy[qi] = { ...copy[qi], options };
      return copy;
    });
  };

  const addQuestion = () => {
    setQuestions(prev => [...prev, emptyQuestion()]);
  };

  const removeQuestion = (qi) => {
    if (questions.length <= 1) return toast.error('At least 1 question required');
    setQuestions(prev => prev.filter((_, i) => i !== qi));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate
    if (!form.title.trim()) return toast.error('Quiz title is required');
    if (!form.category.trim()) return toast.error('Category is required');

    for (let i = 0; i < questions.length; i++) {
      const q = questions[i];
      if (!q.questionText.trim()) return toast.error(`Question ${i + 1} text is empty`);
      const filledOptions = q.options.filter(o => o.text.trim());
      if (filledOptions.length < 2) return toast.error(`Question ${i + 1} needs at least 2 options`);
      const hasCorrect = q.options.some(o => o.isCorrect && o.text.trim());
      if (!hasCorrect) return toast.error(`Question ${i + 1} needs a correct answer`);
    }

    setSubmitting(true);
    try {
      await API.post('/quizzes', {
        ...form,
        timeLimit: Number(form.timeLimit),
        questions: questions.map(q => ({
          ...q,
          options: q.options.filter(o => o.text.trim()),
        })),
      });
      toast.success('Quiz created successfully!');
      navigate('/admin/quizzes');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create quiz');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Sidebar />
      <div className="admin-layout">
        <div className="admin-page-header">
          <div>
            <h1 className="admin-page-title">Create Quiz</h1>
            <p className="admin-page-subtitle">Add a new quiz with questions</p>
          </div>
          <button className="btn btn-ghost" onClick={() => navigate('/admin/quizzes')}>
            ← Back
          </button>
        </div>

        <form onSubmit={handleSubmit} className="quiz-form">
          {/* Quiz Details */}
          <div className="quiz-form-card">
            <h3 className="quiz-form-section-title">Quiz Details</h3>

            <div className="quiz-form-row">
              <div className="input-group" style={{ flex: 2 }}>
                <label>Title *</label>
                <input type="text" placeholder="e.g. JavaScript Fundamentals" value={form.title} onChange={e => updateForm('title', e.target.value)} />
              </div>
              <div className="input-group" style={{ flex: 1 }}>
                <label>Category *</label>
                <input type="text" placeholder="e.g. Tech" value={form.category} onChange={e => updateForm('category', e.target.value)} />
              </div>
            </div>

            <div className="input-group">
              <label>Description</label>
              <textarea rows="2" placeholder="Brief description of the quiz..." value={form.description} onChange={e => updateForm('description', e.target.value)} />
            </div>

            <div className="quiz-form-row">
              <div className="input-group">
                <label>Difficulty</label>
                <select value={form.difficulty} onChange={e => updateForm('difficulty', e.target.value)}>
                  <option value="Easy">Easy</option>
                  <option value="Medium">Medium</option>
                  <option value="Hard">Hard</option>
                </select>
              </div>
              <div className="input-group">
                <label>Time Limit (seconds)</label>
                <input type="number" min="60" value={form.timeLimit} onChange={e => updateForm('timeLimit', e.target.value)} />
              </div>
              <div className="input-group">
                <label>Publish?</label>
                <div className="toggle-wrapper">
                  <label className="toggle">
                    <input type="checkbox" checked={form.isPublished} onChange={e => updateForm('isPublished', e.target.checked)} />
                    <span className="toggle-slider"></span>
                  </label>
                  <span className="toggle-label">{form.isPublished ? 'Published' : 'Draft'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Questions */}
          <h3 className="quiz-form-section-title" style={{ marginTop: '8px' }}>
            Questions ({questions.length})
          </h3>

          {questions.map((q, qi) => (
            <div key={qi} className="quiz-form-card question-card">
              <div className="question-card-header">
                <span className="question-number">Q{qi + 1}</span>
                {questions.length > 1 && (
                  <button type="button" className="btn btn-ghost btn-sm manage-delete-btn" onClick={() => removeQuestion(qi)}>
                    Remove
                  </button>
                )}
              </div>

              <div className="input-group">
                <label>Question Text *</label>
                <input type="text" placeholder="Enter the question..." value={q.questionText} onChange={e => updateQuestion(qi, 'questionText', e.target.value)} />
              </div>

              <div className="options-grid">
                {q.options.map((opt, oi) => (
                  <div key={oi} className={`option-input-row ${opt.isCorrect ? 'correct' : ''}`}>
                    <button
                      type="button"
                      className={`option-correct-btn ${opt.isCorrect ? 'active' : ''}`}
                      onClick={() => updateOption(qi, oi, 'isCorrect', true)}
                      title={opt.isCorrect ? 'Correct answer' : 'Mark as correct'}
                    >
                      {String.fromCharCode(65 + oi)}
                    </button>
                    <input
                      type="text"
                      placeholder={`Option ${String.fromCharCode(65 + oi)}`}
                      value={opt.text}
                      onChange={e => updateOption(qi, oi, 'text', e.target.value)}
                    />
                  </div>
                ))}
              </div>

              <div className="quiz-form-row">
                <div className="input-group" style={{ flex: 1 }}>
                  <label>Points</label>
                  <input type="number" min="1" value={q.points} onChange={e => updateQuestion(qi, 'points', Number(e.target.value))} />
                </div>
                <div className="input-group" style={{ flex: 3 }}>
                  <label>Explanation (optional)</label>
                  <input type="text" placeholder="Why this is the correct answer..." value={q.explanation} onChange={e => updateQuestion(qi, 'explanation', e.target.value)} />
                </div>
              </div>
            </div>
          ))}

          <button type="button" className="btn btn-secondary btn-full add-question-btn" onClick={addQuestion}>
            + Add Question
          </button>

          {/* Submit */}
          <div className="quiz-form-submit">
            <button type="button" className="btn btn-ghost" onClick={() => navigate('/admin/quizzes')}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting ? 'Creating...' : 'Create Quiz'}
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default CreateQuiz;
