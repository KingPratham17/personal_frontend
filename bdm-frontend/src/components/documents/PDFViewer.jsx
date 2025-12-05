import React, { useState } from 'react';
import { ZoomIn, ZoomOut, Download, RefreshCw, Maximize2 } from 'lucide-react';
import { Button } from '../common';

export default function PDFViewer({ pdfUrl, documentName = 'document' }) {
  const [zoom, setZoom] = useState(100);
  const [error, setError] = useState(false);

  if (!pdfUrl) {
    return (
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        minHeight: '400px',
        color: '#64748b',
        fontSize: '0.95rem'
      }}>
        No PDF selected for preview
      </div>
    );
  }

  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev + 25, 200));
  };

  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev - 25, 50));
  };

  const handleReset = () => {
    setZoom(100);
    setError(false);
  };

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = pdfUrl;
    link.download = `${documentName}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleFullscreen = () => {
    window.open(pdfUrl, '_blank');
  };

  if (error) {
    return (
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column',
        alignItems: 'center', 
        justifyContent: 'center',
        minHeight: '400px',
        gap: '1rem'
      }}>
        <p style={{ color: '#ef4444', fontSize: '0.95rem' }}>
          Failed to load PDF. The file might be corrupted or unavailable.
        </p>
        <Button variant="outline" icon={RefreshCw} onClick={handleReset}>
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column',
      height: '100%',
      background: '#f8fafc'
    }}>
      {/* Toolbar */}
      <div style={{ 
        padding: '0.75rem 1rem',
        borderBottom: '1px solid #e2e8f0',
        background: 'white',
        display: 'flex',
        gap: '0.5rem',
        alignItems: 'center',
        flexWrap: 'wrap'
      }}>
        <Button 
          variant="outline" 
          size="sm" 
          icon={ZoomOut} 
          onClick={handleZoomOut}
          disabled={zoom <= 50}
        >
          Zoom Out
        </Button>

        <span style={{ 
          padding: '0.25rem 0.75rem',
          background: '#f8fafc',
          borderRadius: '6px',
          fontSize: '0.85rem',
          fontWeight: 600,
          color: '#475569',
          minWidth: '60px',
          textAlign: 'center'
        }}>
          {zoom}%
        </span>

        <Button 
          variant="outline" 
          size="sm" 
          icon={ZoomIn} 
          onClick={handleZoomIn}
          disabled={zoom >= 200}
        >
          Zoom In
        </Button>

        <div style={{ flex: 1 }} />

        <Button 
          variant="outline" 
          size="sm" 
          icon={RefreshCw} 
          onClick={handleReset}
        >
          Reset
        </Button>

        <Button 
          variant="outline" 
          size="sm" 
          icon={Maximize2} 
          onClick={handleFullscreen}
        >
          Fullscreen
        </Button>

        <Button 
          variant="primary" 
          size="sm" 
          icon={Download} 
          onClick={handleDownload}
        >
          Download
        </Button>
      </div>

      {/* PDF Container */}
      <div style={{ 
        flex: 1, 
        overflow: 'auto',
        display: 'flex',
        justifyContent: 'center',
        padding: '1rem',
        background: '#e2e8f0'
      }}>
        <div style={{ 
          width: `${zoom}%`,
          background: 'white',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
          transition: 'width 0.2s ease'
        }}>
          <iframe
            src={pdfUrl}
            width="100%"
            height="100%"
            style={{ 
              border: 'none',
              minHeight: '600px',
              display: 'block'
            }}
            title="PDF Preview"
            onError={() => setError(true)}
          />
        </div>
      </div>
    </div>
  );
}