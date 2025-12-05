import React from 'react';

export function FormGroup({ 
  label, 
  error, 
  required = false, 
  children,
  inline = false,
  className = ''
}) {
  const groupClass = inline ? 'form-group-inline' : 'form-group';
  
  return (
    <div className={`${groupClass} ${className}`}>
      {label && (
        <label className="form-label">
          {label}
          {required && <span className="required" style={{ color: 'var(--danger)', marginLeft: '2px' }}>*</span>}
        </label>
      )}
      {children}
      {error && <span className="form-error" style={{ display: 'block', marginTop: '0.25rem', color: 'var(--danger)', fontSize: '0.875rem' }}>{error}</span>}
    </div>
  );
}