import './ActivityItem.css';

const categoryColors = {
  'Tech & Innovation': '#4A90D9',
  'Global Geography': '#4CAF50',
  'Classic Literature': '#FFC107',
  Science: '#FF5252',
  History: '#7B5EA7',
};

const ActivityItem = ({ title, date, score, total, percentage, category }) => {
  const color = categoryColors[category] || 'var(--accent-purple)';

  return (
    <div className="activity-item">
      <div className="activity-item-left">
        <div className="activity-item-icon" style={{ background: `${color}20`, color }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 19.5A2.5 2.5 0 016.5 17H20"/>
            <path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"/>
          </svg>
        </div>
        <div>
          <h4 className="activity-item-title">{title}</h4>
          <p className="activity-item-date">
            {new Date(date).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            })}
          </p>
        </div>
      </div>
      <div className="activity-item-score">
        <span className="pill pill-success">
          {score}/{total} · {percentage}%
        </span>
      </div>
    </div>
  );
};

export default ActivityItem;
