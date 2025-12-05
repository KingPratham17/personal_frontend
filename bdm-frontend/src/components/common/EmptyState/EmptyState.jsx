export function EmptyState({ icon: Icon, title, message, action }) {
  return (
    <div className="empty-state" style={{ textAlign: 'center', padding: '3rem 1rem' }}>
      {Icon && (
        <Icon 
          size={64} 
          className="empty-state-icon" 
          style={{ opacity: 0.35, margin: '0 auto 1rem' }} 
        />
      )}
      {title && <h3 style={{ marginBottom: '0.5rem', color: '#64748b' }}>{title}</h3>}
      {message && <p style={{ color: '#94a3b8', marginBottom: '1rem' }}>{message}</p>}
      {action && <div className="empty-state-action">{action}</div>}
    </div>
  );
}