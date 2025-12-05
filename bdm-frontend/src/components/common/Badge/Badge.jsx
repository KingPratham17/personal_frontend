import React from 'react';

export function Badge({ variant = 'primary', children, className = '', ...props }) {
  return (
    <span className={`badge badge-${variant} ${className}`} {...props}>
      {children}
    </span>
  );
}