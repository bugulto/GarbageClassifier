import { AlertCircle } from 'lucide-react'

export const EmptyState = ({ title, description, icon: Icon = AlertCircle, children }) => {
  return (
    <div className="empty-state">
      <div className="empty-state-icon">
        <Icon size={48} strokeWidth={1.5} />
      </div>
      <h3>{title}</h3>
      <p>{description}</p>
      {children && <div className="empty-state-actions">{children}</div>}
    </div>
  )
}
