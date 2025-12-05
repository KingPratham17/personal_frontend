import React from 'react';
import { CheckCircle, XCircle, Info, AlertCircle, X } from 'lucide-react';

const icons = {
  success: CheckCircle,
  error: XCircle,
  info: Info,
  warning: AlertCircle
};

export function Notification({ message, type = 'info', onClose }) {
  const Icon = icons[type];
  
  return (
    <div className={`alert alert-${type}`} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
      {Icon && <Icon size={20} />}
      <span style={{ flex: 1 }}>{message}</span>
      {onClose && (
        <button 
          onClick={onClose} 
          className="alert-close"
          style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '0.25rem' }}
          aria-label="Close notification"
        >
          <X size={18} />
        </button>
      )}
    </div>
  );
}