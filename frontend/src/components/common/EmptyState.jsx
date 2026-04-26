import './EmptyState.css';

const illustrations = {
  quiz: (
    <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
      <rect x="16" y="12" width="48" height="56" rx="6" fill="#1A1A35" stroke="#7B5EA7" strokeWidth="1.5" strokeDasharray="4 4"/>
      <line x1="26" y1="28" x2="54" y2="28" stroke="#5A5A7A" strokeWidth="2" strokeLinecap="round"/>
      <line x1="26" y1="38" x2="46" y2="38" stroke="#5A5A7A" strokeWidth="2" strokeLinecap="round"/>
      <line x1="26" y1="48" x2="50" y2="48" stroke="#5A5A7A" strokeWidth="2" strokeLinecap="round"/>
      <circle cx="58" cy="58" r="14" fill="#7B5EA7" opacity="0.2"/>
      <text x="58" y="63" textAnchor="middle" fill="#7B5EA7" fontSize="14" fontWeight="700">?</text>
    </svg>
  ),
  results: (
    <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
      <rect x="10" y="24" width="12" height="40" rx="3" fill="#4A90D9" opacity="0.3"/>
      <rect x="28" y="16" width="12" height="48" rx="3" fill="#7B5EA7" opacity="0.4"/>
      <rect x="46" y="32" width="12" height="32" rx="3" fill="#4A90D9" opacity="0.3"/>
      <rect x="64" y="8" width="12" height="56" rx="3" fill="#7B5EA7" opacity="0.5"/>
      <line x1="6" y1="64" x2="78" y2="64" stroke="#5A5A7A" strokeWidth="1.5" strokeDasharray="4 3"/>
    </svg>
  ),
  users: (
    <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
      <circle cx="40" cy="28" r="12" fill="#7B5EA7" opacity="0.2" stroke="#7B5EA7" strokeWidth="1.5"/>
      <circle cx="24" cy="36" r="8" fill="#4A90D9" opacity="0.15" stroke="#4A90D9" strokeWidth="1"/>
      <circle cx="56" cy="36" r="8" fill="#4A90D9" opacity="0.15" stroke="#4A90D9" strokeWidth="1"/>
      <path d="M16 64c0-10 10-18 24-18s24 8 24 18" fill="#7B5EA7" opacity="0.1" stroke="#7B5EA7" strokeWidth="1.5"/>
    </svg>
  ),
};

const EmptyState = ({ type = 'quiz', title, message, action, onAction }) => {
  return (
    <div className="empty-state">
      <div className="empty-state-illustration">
        {illustrations[type] || illustrations.quiz}
      </div>
      <h3 className="empty-state-title">{title || 'Nothing here yet'}</h3>
      <p className="empty-state-message">{message || 'Get started by creating something.'}</p>
      {action && onAction && (
        <button className="btn btn-primary" onClick={onAction}>
          {action}
        </button>
      )}
    </div>
  );
};

export default EmptyState;
