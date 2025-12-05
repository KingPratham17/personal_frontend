import React, { useState } from 'react';

export function Tabs({ tabs, defaultTab, onChange, className = '' }) {
    const [activeTab, setActiveTab] = useState(defaultTab || tabs[0]?.id);

    const handleTabChange = (tabId) => {
        setActiveTab(tabId);
        onChange?.(tabId);
    };

    return (
        <div className={`tabs-container ${className}`}>
            <div className="tabs" style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        className={`tab ${activeTab === tab.id ? 'active' : ''}`}
                        onClick={() => handleTabChange(tab.id)}
                        style={{
                            padding: '0.75rem 1.25rem',
                            border: '1px solid var(--border)',
                            borderRadius: '8px 8px 0 0',
                            background: activeTab === tab.id ? 'var(--surface)' : '#f8fbff',
                            color: activeTab === tab.id ? 'var(--primary)' : 'var(--text-muted)',
                            fontWeight: 600,
                            cursor: 'pointer'
                        }}
                    >
                        {tab.icon && <span style={{ marginRight: '0.5rem' }}>{tab.icon}</span>}
                        {tab.label}
                    </button>
                ))}
            </div>
            <div className="tab-content">
                {tabs.find(tab => tab.id === activeTab)?.content}
            </div>
        </div>
    );
}