export const SectionHeader = ({ title, icon: Icon, subtitle, className = '' }) => {
  return (
    <div className={`section-header ${className}`}>
      <div>
        <h2>
          {Icon && <Icon size={20} className="text-muted" />}
          {title}
        </h2>
        {subtitle && <p className="text-muted" style={{ fontSize: '14px', marginTop: '4px' }}>{subtitle}</p>}
      </div>
    </div>
  )
}
