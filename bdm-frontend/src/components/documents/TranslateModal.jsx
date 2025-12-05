import React, { useEffect } from 'react';
import { X, CheckCircle, Download } from 'lucide-react';
import { Button, Modal } from '../common';

export default function TranslateModal({
  open = false,
  onClose = () => {},
  english = '',
  translated = '',
  lang = 'es',
  confirmed = false,
  onConfirm = () => {},
  onDownload = () => {}
}) {
  useEffect(() => {
    if (!open) return;
    
    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose();
    };
    
    document.addEventListener('keydown', handleEscape);
    
    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [open, onClose]);

  if (!open) return null;

  const renderTextOrEmpty = (text) => {
    let displayText = '';
    
    if (!text) {
      return (
        <div style={{ color: '#64748b', fontStyle: 'italic' }}>
          No content available.
        </div>
      );
    }
    
    // Handle different text types
    if (typeof text === 'object') {
      if (text.text) {
        displayText = String(text.text);
      } else {
        displayText = JSON.stringify(text, null, 2);
      }
    } else {
      displayText = String(text);
    }
    
    if (displayText.trim().length === 0) {
      return (
        <div style={{ color: '#64748b', fontStyle: 'italic' }}>
          No content available.
        </div>
      );
    }
    
    return (
      <pre style={{ 
        whiteSpace: 'pre-wrap', 
        wordBreak: 'break-word', 
        margin: 0,
        fontFamily: 'inherit',
        fontSize: 'inherit'
      }}>
        {displayText}
      </pre>
    );
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal modal-xl"
        onClick={(e) => e.stopPropagation()}
        style={{ 
          display: 'flex', 
          flexDirection: 'column',
          maxHeight: '85vh'
        }}
      >
        {/* Header */}
        <div className="modal-header">
          <div>
            <h3 style={{ margin: 0, fontSize: '1.25rem' }}>
              Translation Preview & Confirmation
            </h3>
            <small style={{ color: '#64748b' }}>
              Language: <strong>{lang.toUpperCase()}</strong>
            </small>
          </div>
          
          <button onClick={onClose} className="btn-close-modal">
            <X size={24} />
          </button>
        </div>

        {/* Body - Two Column Layout */}
        <div 
          className="modal-body" 
          style={{ 
            display: 'grid', 
            gridTemplateColumns: '1fr 1fr', 
            gap: '1rem',
            flex: 1,
            overflow: 'hidden'
          }}
        >
          {/* English Column */}
          <div style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            gap: '0.5rem',
            minHeight: 0
          }}>
            <div style={{ 
              fontWeight: 600, 
              marginBottom: '0.25rem',
              fontSize: '0.95rem',
              color: '#475569'
            }}>
              📄 English (Original)
            </div>
            
            <div style={{ 
              background: '#fff', 
              border: '1px solid #e2e8f0', 
              borderRadius: '8px', 
              padding: '1rem',
              flex: 1,
              overflowY: 'auto',
              fontSize: '0.9rem',
              lineHeight: '1.6'
            }}>
              {renderTextOrEmpty(english)}
            </div>
          </div>

          {/* Translated Column */}
          <div style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            gap: '0.5rem',
            minHeight: 0
          }}>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              marginBottom: '0.25rem'
            }}>
              <div style={{ 
                fontWeight: 600,
                fontSize: '0.95rem',
                color: '#475569'
              }}>
                🌐 Translated ({lang.toUpperCase()})
              </div>
              
              {confirmed ? (
                <span style={{ 
                  fontSize: '0.8rem', 
                  color: '#10b981', 
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.25rem'
                }}>
                  <CheckCircle size={14} /> Confirmed
                </span>
              ) : (
                <span style={{ 
                  fontSize: '0.8rem', 
                  color: '#6b7280',
                  fontStyle: 'italic'
                }}>
                  Preview Only
                </span>
              )}
            </div>
            
            <div style={{ 
              background: confirmed ? '#f0fdf4' : '#fff', 
              border: confirmed ? '1px solid #86efac' : '1px solid #e2e8f0',
              borderRadius: '8px', 
              padding: '1rem',
              flex: 1,
              overflowY: 'auto',
              fontSize: '0.9rem',
              lineHeight: '1.6'
            }}>
              {renderTextOrEmpty(translated)}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="modal-footer" style={{ 
          display: 'flex', 
          gap: '0.75rem',
          flexWrap: 'wrap',
          justifyContent: 'space-between'
        }}>
          {/* Left side - Close and Confirm */}
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>

            {!confirmed ? (
              <Button
                variant="primary"
                onClick={async () => {
                  try {
                    await onConfirm();
                  } catch (e) {
                    console.error('Confirm error:', e);
                  }
                }}
              >
                ✅ Confirm Translation
              </Button>
            ) : (
              <Button variant="success" disabled>
                <CheckCircle size={16} /> Translation Confirmed
              </Button>
            )}
          </div>

          {/* Right side - Download options */}
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <Button
              variant="outline"
              icon={Download}
              onClick={() => onDownload('en')}
              title="Download English PDF"
            >
              English
            </Button>

            <Button
              variant="outline"
              icon={Download}
              onClick={() => onDownload('translated')}
              title="Download translated PDF"
              disabled={!confirmed}
            >
              {lang.toUpperCase()}
            </Button>

            <Button
              variant="primary"
              icon={Download}
              onClick={() => onDownload('both')}
              title="Download bilingual PDF (side-by-side)"
              disabled={!confirmed}
            >
              Bilingual
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}