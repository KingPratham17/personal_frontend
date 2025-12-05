import React from 'react';
import { Eye, Edit3, Download, Trash2, Globe, CheckCircle } from 'lucide-react';
import { Button } from '../common';
import { pdfAPI } from '../../services/api';

export function DocumentCard({
  document,
  languages,
  hasTranslation,
  translating,
  onEdit,
  onDelete,
  onPreviewPDF,
  onTranslate
}) {
  return (
    <div className="card" style={{ padding: '1rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 600 }}>
            {document.document_name}
          </h3>
          <p style={{ margin: '0.25rem 0 0', fontSize: '0.9rem', color: '#64748b' }}>
            📄 {document.document_type} • {new Date(document.created_at).toLocaleDateString()}
            {hasTranslation && (
              <span style={{ 
                marginLeft: '0.5rem', 
                color: '#10b981', 
                display: 'inline-flex', 
                alignItems: 'center', 
                gap: '0.25rem' 
              }}>
                <CheckCircle size={14} /> {hasTranslation.lang.toUpperCase()} Translated
              </span>
            )}
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <Button
            variant="secondary"
            size="sm"
            icon={Eye}
            onClick={() => onPreviewPDF(pdfAPI.getPreviewUrl(document.id))}
          >
            Preview
          </Button>

          <Button
            variant="outline"
            size="sm"
            icon={Edit3}
            onClick={() => onEdit(document)}
          >
            Edit
          </Button>

          <Button
            variant="success"
            size="sm"
            icon={Download}
            onClick={() => pdfAPI.download(document.id, document.document_name)}
          >
            Download
          </Button>

          <Button
            variant="danger"
            size="sm"
            icon={Trash2}
            onClick={() => onDelete(document.id)}
          >
            Delete
          </Button>

          <div style={{
            marginLeft: '8px',
            padding: '8px 12px',
            borderRadius: '8px',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            display: 'flex',
            gap: '8px',
            alignItems: 'center'
          }}>
            <Globe size={16} color="white" />
            <select
              style={{
                padding: '4px 8px',
                borderRadius: '6px',
                border: 'none',
                fontSize: '0.875rem'
              }}
              onChange={(e) => {
                if (e.target.value && e.target.value !== 'select') {
                  onTranslate(document.id, e.target.value);
                }
              }}
              disabled={translating}
            >
              <option value="select">Translate to...</option>
              {languages.map(lang => (
                <option key={lang.code} value={lang.code}>
                  {lang.flag} {lang.label}
                </option>
              ))}
            </select>
            {translating && (
              <div className="spinner" style={{ width: '14px', height: '14px', borderWidth: '2px' }} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}