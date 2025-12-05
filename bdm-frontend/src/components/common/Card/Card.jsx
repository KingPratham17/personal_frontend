import React from 'react';

export function Card({ 
  title, 
  actions, 
  children, 
  className = '',
  style = {},
  ...props 
}) {
  return (
    <div className={`card ${className}`} style={style} {...props}>
      {(title || actions) && (
        <div className="card-header">
          {title && <h3 className="card-title">{title}</h3>}
          {actions && <div className="card-actions">{actions}</div>}
        </div>
      )}
      <div className="card-body">{children}</div>
    </div>
  );
}