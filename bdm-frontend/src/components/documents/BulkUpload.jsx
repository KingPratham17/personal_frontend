import React, { useState } from 'react';
import { Upload, Download, AlertCircle } from 'lucide-react';
import { Button, Card, FormGroup } from '../common';

export function BulkUpload({ 
  selectedTemplate, 
  onBulkGenerate, 
  showNotification 
}) {
  const [bulkFile, setBulkFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.name.endsWith('.xlsx') && !file.name.endsWith('.xls')) {
        showNotification('Please upload an Excel file (.xlsx or .xls)', 'error');
        return;
      }
      setBulkFile(file);
    }
  };

  const handleBulkGenerate = async () => {
    if (!selectedTemplate) {
      return showNotification('Please select a template first', 'error');
    }
    if (!bulkFile) {
      return showNotification('Please upload an Excel file', 'error');
    }

    setUploading(true);
    try {
      await onBulkGenerate(selectedTemplate.id, bulkFile);
      showNotification('Bulk documents generated successfully!', 'success');
      setBulkFile(null);
      // Reset file input
      const fileInput = document.getElementById('bulk-file-input');
      if (fileInput) fileInput.value = '';
    } catch (error) {
      console.error('Bulk generation error:', error);
      const msg = error?.response?.data?.message || 
                  error?.response?.data?.error || 
                  error.message || 
                  'Failed to generate bulk documents';
      showNotification(msg, 'error');
    } finally {
      setUploading(false);
    }
  };

  return (
    <Card title="📊 Bulk Document Generation">
      <div style={{ marginBottom: '1rem' }}>
        <p style={{ fontSize: '0.9rem', color: '#64748b', marginBottom: '1rem' }}>
          Upload an Excel file with placeholder values to generate multiple documents at once.
          The Excel columns should match the template placeholders.
        </p>

        {!selectedTemplate && (
          <div className="alert alert-warning" style={{ marginBottom: '1rem' }}>
            <AlertCircle size={18} />
            <span>Please select a template first before uploading Excel file</span>
          </div>
        )}
      </div>

      <FormGroup label="Excel File">
        <input
          id="bulk-file-input"
          type="file"
          accept=".xlsx,.xls"
          onChange={handleFileChange}
          disabled={!selectedTemplate || uploading}
          style={{ display: 'none' }}
        />
        
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
          <Button
            variant="secondary"
            icon={Upload}
            onClick={() => document.getElementById('bulk-file-input')?.click()}
            disabled={!selectedTemplate || uploading}
          >
            {bulkFile ? `${bulkFile.name}` : 'Choose Excel File'}
          </Button>

          <Button
            variant="success"
            icon={Download}
            onClick={handleBulkGenerate}
            disabled={!bulkFile || uploading}
            loading={uploading}
          >
            {uploading ? 'Generating...' : 'Generate Documents'}
          </Button>
        </div>
      </FormGroup>

      <div style={{ 
        marginTop: '1.5rem', 
        padding: '1rem', 
        background: '#f8fafc', 
        borderRadius: '8px',
        fontSize: '0.85rem',
        color: '#475569'
      }}>
        <strong>💡 Tips:</strong>
        <ul style={{ marginTop: '0.5rem', paddingLeft: '1.5rem' }}>
          <li>First row should contain placeholder names (matching template placeholders)</li>
          <li>Each subsequent row will generate one document</li>
          <li>Documents will be downloaded as a ZIP file</li>
          <li>Maximum 100 documents per batch</li>
        </ul>
      </div>
    </Card>
  );
}