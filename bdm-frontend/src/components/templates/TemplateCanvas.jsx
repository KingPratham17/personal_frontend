import React, { useState } from 'react';
import { ArrowUp, ArrowDown, Trash2 } from 'lucide-react';
import { Button } from '../common';

export function TemplateCanvas({
  selectedClauses,
  onRemoveClause,
  onMoveUp,
  onMoveDown
}) {
  const [dragOver, setDragOver] = useState(false);

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);

    try {
      const clauseData = e.dataTransfer.getData('clause');
      if (clauseData) {
        const clause = JSON.parse(clauseData);
        if (!selectedClauses.find(c => c.id === clause.id)) {
          // This will be handled by parent
          console.log('Dropped clause:', clause);
        }
      }
    } catch (err) {
      console.error('Drop error:', err);
    }
  };

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      style={{
        marginTop: '1rem',
        minHeight: '150px',
        border: dragOver ? '2px dashed #3b82f6' : '2px dashed #94a3b8',
        padding: '12px',
        borderRadius: '8px',
        backgroundColor: dragOver ? '#eff6ff' : '#f8fafc'
      }}
    >
      {selectedClauses.length === 0 ? (
        <p style={{ color: '#64748b', textAlign: 'center', margin: '1rem' }}>
          Drag clauses from the left here to build your template order.
        </p>
      ) : (
        selectedClauses.map((clause, index) => (
          <div
            key={clause.id}
            style={{
              borderBottom: '1px solid #eee',
              padding: '8px 0',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}
          >
            <div style={{ flexGrow: 1 }}>
              <span>{index + 1}. </span>
              <strong style={{ fontWeight: 600 }}>{clause.clause_type}</strong>{' '}
              <span style={{ color: '#64748b', fontSize: '0.85rem' }}>
                ({clause.category})
              </span>
            </div>

            <div style={{ display: 'flex', gap: '5px' }}>
              <button
                onClick={() => onMoveUp(index)}
                disabled={index === 0}
                style={{
                  border: 'none',
                  background: 'none',
                  cursor: index === 0 ? 'not-allowed' : 'pointer',
                  padding: '4px'
                }}
              >
                <ArrowUp
                  size={14}
                  style={{ color: index === 0 ? '#ccc' : '#3b82f6' }}
                />
              </button>

              <button
                onClick={() => onMoveDown(index)}
                disabled={index === selectedClauses.length - 1}
                style={{
                  border: 'none',
                  background: 'none',
                  cursor: index === selectedClauses.length - 1 ? 'not-allowed' : 'pointer',
                  padding: '4px'
                }}
              >
                <ArrowDown
                  size={14}
                  style={{ color: index === selectedClauses.length - 1 ? '#ccc' : '#3b82f6' }}
                />
              </button>

              <button
                onClick={() => onRemoveClause(clause.id)}
                style={{
                  border: 'none',
                  background: 'none',
                  cursor: 'pointer',
                  color: '#ef4444',
                  padding: '4px'
                }}
              >
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}