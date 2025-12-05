import React from 'react';

export function Button({ 
  variant = 'primary', 
  size = 'md', 
  icon: Icon,
  children, 
  disabled = false,
  loading = false,
  type = 'button',
  className = '',
  onClick,
  ...props 
}) {
  const classNames = [
    'btn',
    `btn-${variant}`,
    size !== 'md' && `btn-${size}`,
    loading && 'btn-loading',
    className
  ].filter(Boolean).join(' ');

  return (
    <button 
      type={type}
      className={classNames} 
      disabled={disabled || loading} 
      onClick={onClick}
      {...props}
    >
      {loading ? (
        <>
          <span className="spinner-small" style={{ width: '14px', height: '14px', marginRight: '6px' }} />
          Loading...
        </>
      ) : (
        <>
          {Icon && <Icon size={16} />}
          {children}
        </>
      )}
    </button>
  );
}