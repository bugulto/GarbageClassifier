export const StatCard = ({ label, value, icon: Icon, valueClass = '' }) => {
  return (
    <div className="stat-card">
      <div className="stat-label">
        {Icon && <Icon size={16} />}
        {label}
      </div>
      <div className={`stat-value ${valueClass}`}>{value}</div>
    </div>
  )
}
