import React, { useState, useEffect } from 'react';
import { Save, Eye } from 'lucide-react';
import { Button, Card, FormGroup, Loading, EmptyState } from '../common';
import { documentsAPI } from '../../services/api';
import { extractPlaceholders } from '../../utils/formatters';

export function TemplateDocumentForm({ templates, onSuccess, showNotification }) {
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [placeholders, setPlaceholders] = useState([]);
  const [placeholderValues, setPlaceholderValues] = useState({});
  const [documentName, setDocumentName] = useState('');
  const [generating, setGenerating] = useState(false);
  const [loadingTemplate, setLoadingTemplate] = useState(false);

  // Bulk Excel state
  const [bulkExcelFile, setBulkExcelFile] = useState(null);
  const [bulkGenerating, setBulkGenerating] = useState(false);

  const handleSelectTemplate = async (template) => {
    setLoadingTemplate(true);
    setSelectedTemplate(null);
    setPlaceholders([]);
    setPlaceholderValues({});
    setDocumentName('');

    try {
      const { templatesAPI } = await import('../../services/api');
      const res = await templatesAPI.getById(template.id);
      const templateData = res.data.data;

      if (!templateData || !Array.isArray(templateData.clauses)) {
        throw new Error('Invalid template data');
      }

      setSelectedTemplate(templateData);

      // Extract placeholders
      const foundPlaceholders = new Set();
      templateData.clauses.forEach(clause => {
        if (clause && typeof clause.content === 'string') {
          const extracted = extractPlaceholders(clause.content);
          extracted.forEach(p => foundPlaceholders.add(p));
        }
      });

      const placeholderArray = Array.from(foundPlaceholders);
      setPlaceholders(placeholderArray);

      const initialValues = {};
      placeholderArray.forEach(p => initialValues[p] = '');
      setPlaceholderValues(initialValues);
      setDocumentName(`${templateData.template_name}_${Date.now()}`);

      showNotification(`Template selected. Fill ${placeholderArray.length} placeholders.`, 'info');
    } catch (err) {
      showNotification('Failed to load template', 'error');
    } finally {
      setLoadingTemplate(false);
    }
  };

  const handleGenerate = async (e) => {
    if (e) e.preventDefault();
    
    if (!selectedTemplate) return showNotification('Please select a template first', 'error');

    const emptyPlaceholders = placeholders.filter(p => !placeholderValues[p]);
    if (emptyPlaceholders.length > 0) {
      const confirmContinue = window.confirm(
        `Warning: ${emptyPlaceholders.length} placeholders are empty:\n- ${emptyPlaceholders.join('\n- ')}\n\nContinue anyway?`
      );
      if (!confirmContinue) return;
    }

    try {
      setGenerating(true);
      await documentsAPI.generate({
        template_id: selectedTemplate.id,
        document_name: documentName || `${selectedTemplate.template_name}_${Date.now()}`,
        document_type: selectedTemplate.document_type,
        context: placeholderValues
      });

      onSuccess?.();
      setSelectedTemplate(null);
    } catch (err) {
      showNotification('Generation failed', 'error');
    } finally {
      setGenerating(false);
    }
  };

  const handleBulkGenerate = async () => {
    if (!selectedTemplate) {
      return showNotification('Please select a template first', 'error');
    }
    if (!bulkExcelFile) {
      return showNotification('Please upload an Excel file first', 'error');
    }

    try {
      setBulkGenerating(true);
      showNotification('Starting bulk generation. Please wait...', 'info');

      const res = await documentsAPI.bulkGenerateFromExcel(selectedTemplate.id, bulkExcelFile);
      const blob = new Blob([res.data], { type: 'application/zip' });

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `bulk_documents_${Date.now()}.zip`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);

      showNotification('Bulk documents generated successfully. ZIP downloaded.', 'success');
    } catch (err) {
      const msg = err?.response?.data?.message || err?.response?.data?.error || err.message || 'Failed to bulk-generate documents';
      showNotification(msg, 'error');
    } finally {
      setBulkGenerating(false);
    }
  };

  if (loadingTemplate) {
    return <Loading text="Loading template..." />;
  }

  return (
    <>
      {!selectedTemplate ? (
        <Card title="📋 Select a Template">
          {templates.length === 0 ? (
            <EmptyState
              title="No templates available"
              message="Create a template first in the Template Builder"
            />
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
              {templates.map((template) => (
                <div 
                  key={template.id} 
                  className="card" 
                  style={{ cursor: 'pointer', border: '1px solid #ddd' }}
                  onClick={() => handleSelectTemplate(template)}
                >
                  {template.is_ai_generated && (
                    <span className="ai-badge" style={{ position: 'absolute', top: '10px', right: '10px' }}>
                      🤖 AI
                    </span>
                  )}
                  <h3 style={{ marginBottom: '0.5rem' }}>{template.template_name}</h3>
                  <p style={{ fontSize: '0.9rem', color: '#64748b' }}>📄 {template.document_type}</p>
                  <Button variant="primary" style={{ marginTop: '1rem', width: '100%' }}>
                    Select Template
                  </Button>
                </div>
              ))}
            </div>
          )}
        </Card>
      ) : (
        <>
          <Card
            title={`✏️ Fill Template: ${selectedTemplate.template_name}`}
            actions={
              <Button variant="secondary" onClick={() => setSelectedTemplate(null)}>
                Change Template
              </Button>
            }
          >
            <form onSubmit={handleGenerate}>
              <FormGroup label="Document Name" required>
                <input
                  type="text"
                  value={documentName}
                  onChange={(e) => setDocumentName(e.target.value)}
                  className="form-input"
                  placeholder="Document name"
                  required
                />
              </FormGroup>

              {placeholders.length > 0 && (
                <>
                  <h3 style={{ fontSize: '1rem', fontWeight: 600, marginTop: '1.5rem', marginBottom: '1rem' }}>
                    Fill Placeholders ({placeholders.length})
                  </h3>
                  <div style={{ maxHeight: '400px', overflowY: 'auto', marginBottom: '1.5rem' }}>
                    {placeholders.map((placeholder) => (
                      <FormGroup key={placeholder} label={placeholder} inline>
                        <input
                          type="text"
                          className="form-input"
                          value={placeholderValues[placeholder] || ''}
                          onChange={(e) => setPlaceholderValues(prev => ({
                            ...prev,
                            [placeholder]: e.target.value
                          }))}
                          required
                        />
                      </FormGroup>
                    ))}
                  </div>
                </>
              )}

              <div style={{ display: 'flex', gap: '1rem' }}>
                <Button type="submit" variant="success" loading={generating} icon={Save}>
                  Generate Document
                </Button>
              </div>
            </form>
          </Card>

          <Card title="📊 Bulk Generate from Excel" style={{ marginTop: '1.5rem' }}>
            <input
              id="excelFileInput"
              type="file"
              accept=".xlsx,.xls"
              style={{ display: 'none' }}
              onChange={(e) => setBulkExcelFile(e.target.files?.[0] || null)}
            />

            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
              <Button
                variant="secondary"
                onClick={() => document.getElementById("excelFileInput").click()}
                disabled={bulkGenerating}
              >
                {bulkExcelFile ? "Excel Uploaded ✔" : "Choose Excel File"}
              </Button>

              <Button
                variant="primary"
                onClick={handleBulkGenerate}
                disabled={bulkGenerating || !bulkExcelFile}
                loading={bulkGenerating}
              >
                Generate Documents from Excel
              </Button>
            </div>
          </Card>
        </>
      )}
    </>
  );
}