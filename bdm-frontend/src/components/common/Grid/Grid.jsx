import React from 'react';

export function Grid({ 
  cols = 2, 
  gap = 'md', 
  children, 
  className = '',
  ...props 
}) {
  const gridClass = `grid grid-${cols} ${className}`;
  return <div className={gridClass} {...props}>{children}</div>;
}
