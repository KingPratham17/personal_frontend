import React, { useEffect, useState, useMemo } from 'react';
import { useTemplates } from '../../hooks/useTemplates';
import { useClauses } from '../../hooks/useClauses';
import { useNotification } from '../../hooks/useNotification';
import { Sparkles } from 'lucide-react';
import { Button, Card, Notification } from '../common';
import { TemplateForm } from './TemplateForm';
import { ClauseLibrary } from './ClauseLibrary';
import { TemplateCanvas } from './TemplateCanvas';
import { TemplateList } from './TemplateList';
import PreviewTemplate from './PreviewTemplate';

export default function TemplateBuilder() {
  const { templates, loading: templatesLoading, loadTemplates, createTemplate, updateTemplate, deleteTemplate, generateAITemplate } = useTemplates();
  const { clauses, loading: clausesLoading, loadClauses } = useClauses();
  const { notification, showNotification } = useNotification();

  const [editMode, setEditMode] = useState(false);
  const [currentTemplateId, setCurrentTemplateId] = useState(null);
  const [templateName, setTemplateName] = useState('');
  const [templateType, setTemplateType] = useState('');
  const [description, setDescription] = useState('');
  const [selectedClauses, setSelectedClauses] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [saving, setSaving] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [previewHTML, setPreviewHTML] = useState('');
  const [showTemplateDetailPreview, setShowTemplateDetailPreview] = useState(false);
  const [templateToPreview, setTemplateToPreview] = useState(null);

  useEffect(() => {
    loadTemplates();
    loadClauses();
  }, [loadTemplates, loadClauses]);

  const categories = useMemo(() => {
    return [...new Set(clauses.map(c => c.category).filter(Boolean))].sort();
  }, [clauses]);

  const filteredClauses = useMemo(() => {
    if (!selectedCategory) return clauses;
    return clauses.filter(c => c.category === selectedCategory);
  }, [clauses, selectedCategory]);

  const clausesByCategory = useMemo(() => {
    return filteredClauses.reduce((acc, c) => {
      (acc[c.category] = acc[c.category] || []).push(c);
      return acc;
    }, {});
  }, [filteredClauses]);

  const handleSelectTemplateForEdit = async (templateId) => {
    if (!templateId) return resetForm();

    try {
      const { templatesAPI } = await import('../../services/api');
      const res = await templatesAPI.getById(templateId);
      const t = res.data.data;

      setTemplateName(t.template_name);
      setTemplateType(t.document_type);
      setDescription(t.description);
      setSelectedClauses(t.clauses || []);
      setEditMode(true);
      setCurrentTemplateId(t.id);
      setShowTemplateDetailPreview(false);
      setTemplateToPreview(null);

      showNotification(`Editing template: ${t.template_name}`, 'info');
    } catch (err) {
      showNotification('Failed to load template details', 'error');
    }
  };

  const handleAddClause = (clause) => {
    if (selectedClauses.find(c => c.id === clause.id)) {
      showNotification('Clause already added!', 'warning');
    } else {
      setSelectedClauses(prev => [...prev, { ...clause }]);
    }
  };

  const handleRemoveClause = (id) => {
    setSelectedClauses(prev => prev.filter(c => c.id !== id));
  };

  const moveClauseUp = (index) => {
    if (index === 0) return;
    const arr = [...selectedClauses];
    [arr[index - 1], arr[index]] = [arr[index], arr[index - 1]];
    setSelectedClauses(arr);
  };

  const moveClauseDown = (index) => {
    if (index === selectedClauses.length - 1) return;
    const arr = [...selectedClauses];
    [arr[index], arr[index + 1]] = [arr[index + 1], arr[index]];
    setSelectedClauses(arr);
  };

  const handleSaveTemplate = async () => {
    if (!templateName || !templateType || selectedClauses.length === 0) {
      return showNotification('Fill all details + add clauses', 'error');
    }

    const payload = {
      template_name: templateName,
      document_type: templateType,
      description: description || `Template for ${templateType}`,
      clause_ids: selectedClauses.map(c => c.id)
    };

    setSaving(true);

    try {
      if (editMode) {
        await updateTemplate(currentTemplateId, payload);
        showNotification('Template updated!', 'success');
      } else {
        await createTemplate(payload);
        showNotification('Template created!', 'success');
      }

      resetForm();
      setShowPreview(false);
    } catch (err) {
      showNotification('Save failed!', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteTemplate = async (templateId) => {
    if (!window.confirm('Are you sure you want to delete this template?')) return;

    const result = await deleteTemplate(templateId);
    if (result.success) {
      showNotification('Template deleted successfully!', 'success');
      if (currentTemplateId === templateId) {
        resetForm();
      }
    } else {
      showNotification('Failed to delete template', 'error');
    }
  };

  const handleAICreateTemplate = async () => {
    const docType = window.prompt('Enter document type (e.g., offer_letter):');
    if (!docType) return;

    const templateName = window.prompt('Enter template name:', `${docType}_AI_Template`);
    if (!templateName) return;

    try {
      setAiLoading(true);
      await generateAITemplate({
        template_name: templateName,
        document_type: docType,
        description: `AI-generated template for ${docType}`
      });
      showNotification('AI Template created successfully', 'success');
    } catch (err) {
      showNotification('Failed to generate AI template', 'error');
    } finally {
      setAiLoading(false);
    }
  };

  const handleTemplateDetailPreview = async (templateId) => {
    try {
      const { templatesAPI } = await import('../../services/api');
      const res = await templatesAPI.getById(templateId);
      const t = res.data.data;

      setTemplateToPreview(t);
      setShowTemplateDetailPreview(true);
    } catch (err) {
      showNotification('Failed to load template details for preview', 'error');
    }
  };

  const generateLivePreview = () => {
    if (selectedClauses.length === 0) {
      return showNotification('Add at least one clause', 'error');
    }

    let html = `
      <h2 style="text-align:center; margin-bottom:20px;">
        ${templateName || 'Untitled Template'}
      </h2>
      <p style="text-align:center; color:#555; margin-top:-10px;">
        ${templateType}
      </p>
      <hr style="margin:20px 0;">
    `;

    selectedClauses.forEach((c, i) => {
      const content = c.content_html || c.content || 'Content not available.';
      html += `
        <h3 style="margin-top:18px;">${i + 1}. ${c.clause_type}</h3>
        <div style="line-height:1.6;">${content}</div>
      `;
    });

    setPreviewHTML(html);
    setShowPreview(true);
  };

  const resetForm = () => {
    setTemplateName('');
    setTemplateType('');
    setDescription('');
    setSelectedClauses([]);
    setCurrentTemplateId(null);
    setEditMode(false);

    const el = document.getElementById('edit-template-select');
    if (el) el.value = '';
  };

  return (
    <div style={{ padding: '1.5rem' }}>
      <h1>📝 Template Builder</h1>

      {notification && <Notification {...notification} />}

      <Button
        variant="primary"
        icon={Sparkles}
        onClick={handleAICreateTemplate}
        loading={aiLoading}
      >
        Generate Template with AI
      </Button>

      <hr style={{ margin: '2rem 0' }} />

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '2rem' }}>
        <ClauseLibrary
          categories={categories}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          clausesByCategory={clausesByCategory}
          loading={clausesLoading}
          onAddClause={handleAddClause}
        />

        <div>
          <Card title={editMode ? '✏️ Edit Template' : '➕ Create New Template'}>
            <TemplateForm
              templateName={templateName}
              templateType={templateType}
              description={description}
              onTemplateNameChange={setTemplateName}
              onTemplateTypeChange={setTemplateType}
              onDescriptionChange={setDescription}
            />

            <TemplateCanvas
              selectedClauses={selectedClauses}
              onRemoveClause={handleRemoveClause}
              onMoveUp={moveClauseUp}
              onMoveDown={moveClauseDown}
            />

            <div style={{ display: 'flex', marginTop: '1.5rem', gap: '1rem' }}>
              <Button variant="secondary" onClick={generateLivePreview}>
                Preview Document
              </Button>

              <Button
                variant="success"
                onClick={handleSaveTemplate}
                loading={saving}
                disabled={selectedClauses.length === 0}
              >
                {saving ? 'Saving...' : editMode ? 'Save Changes' : 'Create Template'}
              </Button>

              {editMode && (
                <Button variant="danger" onClick={resetForm}>
                  Cancel Edit
                </Button>
              )}
            </div>
          </Card>
        </div>
      </div>

      <hr style={{ margin: '2rem 0' }} />

      <TemplateList
        templates={templates}
        loading={templatesLoading}
        editMode={editMode}
        currentTemplateId={currentTemplateId}
        onSelectForEdit={handleSelectTemplateForEdit}
        onPreview={handleTemplateDetailPreview}
        onDelete={handleDeleteTemplate}
      />

      {showPreview && (
        <div className="modal-overlay" onClick={() => setShowPreview(false)}>
          <div className="modal modal-lg" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Live Template Preview</h2>
              <div style={{ display: 'flex', gap: '10px' }}>
                <Button variant="primary" onClick={handleSaveTemplate} loading={saving}>
                  Save Template
                </Button>
                <Button variant="secondary" onClick={() => setShowPreview(false)}>
                  Close Preview
                </Button>
              </div>
            </div>
            <hr style={{ margin: '10px 0' }} />
            <div className="modal-body" dangerouslySetInnerHTML={{ __html: previewHTML }} />
          </div>
        </div>
      )}

      {showTemplateDetailPreview && templateToPreview && (
        <PreviewTemplate
          template={templateToPreview}
          onClose={() => {
            setShowTemplateDetailPreview(false);
            setTemplateToPreview(null);
          }}
        />
      )}
    </div>
  );
}