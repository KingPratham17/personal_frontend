import React from 'react';

export function Loading({ text = 'Loading...', fullScreen = false, size = 'md' }) {
    const className = fullScreen ? 'loading loading-fullscreen' : 'loading';
    const spinnerSize = size === 'sm' ? '24px' : size === 'lg' ? '56px' : '40px';

    return (
        <div className={className}>
            <div className="spinner" style={{ width: spinnerSize, height: spinnerSize }} />
            {text && <p>{text}</p>}
        </div>
    );
}