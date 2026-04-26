import './StatCard.css';

const StatCard = ({ label, value, suffix, icon, color }) => {
  return (
    <div className="stat-card" style={{ '--accent': color || 'var(--accent-purple)' }}>
      {icon && <div className="stat-card-icon">{icon}</div>}
      <div className="stat-card-value">
        {value}
        {suffix && <span className="stat-card-suffix">{suffix}</span>}
      </div>
      <div className="stat-card-label">{label}</div>
    </div>
  );
};

export default StatCard;
