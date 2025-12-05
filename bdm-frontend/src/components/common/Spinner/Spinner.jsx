import React from 'react';

export function Spinner({ size = 'md', color = 'var(--primary)' }) {
    const sizes = {
        sm: '20px',
        md: '40px',
        lg: '60px'
    };

    return (
        <div
            className="spinner"
            style={{
                width: sizes[size],
                height: sizes[size],
                border: '3px solid var(--border)',
                borderTopColor: color,
                borderRadius: '50%',
                animation: 'spin 0.8s linear infinite'
            }}
        />
    );
}