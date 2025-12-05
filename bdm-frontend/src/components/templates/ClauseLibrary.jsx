import React from 'react';
import { GripVertical } from 'lucide-react';
import { Card, Loading } from '../common';

export function ClauseLibrary({
  categories,
  selectedCategory,
  onCategoryChange,
  clausesByCategory,
  loading,
  onAddClause
}) {
  const handleDragStart = (e, clause) => {
    e.dataTransfer.setData('clause', JSON.stringify(clause));
    e.dataTransfer.effectAllowed = 'copy';
  };

  return (
    <Card title="📚 Available Clauses">
      <label>Filter Category</label>
      <select
        className="form-select"
        value={selectedCategory}
        onChange={(e) => onCategoryChange(e.target.value)}
        style={{ marginBottom: '1rem' }}
      >
        <option value="">All</option>
        {categories.map((c) => (
          <option key={c}>{c}</option>
        ))}
      </select>

      <div style={{ maxHeight: '70vh', overflowY: 'auto' }}>
        {loading ? (
          <Loading text="Loading clauses..." />
        ) : Object.keys(clausesByCategory).length === 0 ? (
          <p>No clauses found matching the filter.</p>
        ) : (
          Object.keys(clausesByCategory).map((cat) => (
            <div key={cat} style={{ marginBottom: '1rem' }}>
              <h4>📁 {cat}</h4>

              {clausesByCategory[cat].map((clause) => (
                <div
                  key={clause.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, clause)}
                  onClick={() => onAddClause(clause)}
                  style={{
                    padding: '0.5rem',
                    border: '1px solid #eee',
                    marginBottom: '0.25rem',
                    borderRadius: '4px',
                    display: 'flex',
                    gap: '0.5rem',
                    cursor: 'grab',
                    backgroundColor: 'white'
                  }}
                >
                  <GripVertical size={16} style={{ color: '#94a3b8' }} />
                  <div>
                    <p style={{ fontWeight: 600, margin: 0, fontSize: '0.95rem' }}>
                      {clause.clause_type}
                    </p>
                    <p style={{ margin: 0, fontSize: '0.8rem', color: '#64748b' }}>
                      {(clause.content || '').substring(0, 60)}...
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ))
        )}
      </div>
    </Card>
  );
}
