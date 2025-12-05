import React from 'react';
import { Eye, Pencil, Trash2 } from 'lucide-react';
import { Card, Button, Loading } from '../common';

export function TemplateList({
  templates,
  loading,
  editMode,
  currentTemplateId,
  onSelectForEdit,
  onPreview,
  onDelete
}) {
  if (loading) {
    return <Loading text="Loading templates..." />;
  }

  return (
    <Card title="📋 Existing Templates">
      <div style={{ marginBottom: '1rem' }}>
        <label style={{ marginRight: '1rem', fontWeight: 600 }}>
          Select to Edit:
        </label>
        <select
          id="edit-template-select"
          className="form-select"
          value={editMode ? currentTemplateId || '' : ''}
          onChange={(e) => onSelectForEdit(e.target.value)}
          style={{ minWidth: '300px' }}
        >
          <option value="">-- Select an Existing Template --</option>
          {templates.map((t) => (
            <option key={t.id} value={t.id}>
              {t.template_name} ({t.document_type})
            </option>
          ))}
        </select>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '1rem'
        }}
      >
        {templates.map((t) => (
          <div
            key={t.id}
            className="card"
            style={{
              padding: '1rem',
              border: '1px solid #ddd',
              borderRadius: '8px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
              position: 'relative'
            }}
          >
            {t.is_ai_generated && (
              <span
                style={{
                  position: 'absolute',
                  top: '0.5rem',
                  right: '0.5rem',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: 'white',
                  padding: '0.25rem 0.5rem',
                  borderRadius: '6px',
                  fontSize: '0.75rem',
                  fontWeight: 700
                }}
              >
                🤖 AI
              </span>
            )}

            <h3 style={{ margin: 0, fontSize: '1.1rem', paddingRight: '3rem' }}>
              {t.template_name}
            </h3>
            <p style={{ margin: '0.25rem 0 0.75rem', color: '#64748b', fontSize: '0.9rem' }}>
              📄 {t.document_type}
            </p>

            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              <Button
                variant="secondary"
                size="sm"
                icon={Eye}
                onClick={() => onPreview(t.id)}
              >
                Preview
              </Button>

              <Button
                variant="primary"
                size="sm"
                icon={Pencil}
                onClick={() => onSelectForEdit(t.id)}
              >
                Edit
              </Button>

              <Button
                variant="danger"
                size="sm"
                icon={Trash2}
                onClick={() => onDelete(t.id)}
              >
                Delete
              </Button>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}