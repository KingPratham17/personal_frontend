import React, { useEffect, useState } from 'react';
import { useDocuments } from '../../hooks/useDocuments';
import { useTemplates } from '../../hooks/useTemplates';
import { useNotification } from '../../hooks/useNotification';
import { Sparkles, FileText } from 'lucide-react';
import { Button, Notification, Tabs } from '../common';
import { AIDocumentForm } from './AIDocumentForm';
import { TemplateDocumentForm } from './TemplateDocumentForm';
import { DocumentList } from './DocumentList';
import DocumentEditor from './DocumentEditor';
import TranslateModal from './TranslateModal';
import PDFViewer from './PDFViewer';

const LANGUAGES = [
  { code: 'es', label: 'Spanish', flag: '🇪🇸' },
  { code: 'fr', label: 'French', flag: '🇫🇷' },
  { code: 'de', label: 'German', flag: '🇩🇪' },
  { code: 'pt', label: 'Portuguese', flag: '🇵🇹' },
  { code: 'zh', label: 'Chinese', flag: '🇨🇳' },
  { code: 'ru', label: 'Russian', flag: '🇷🇺' },
  { code: 'ar', label: 'Arabic', flag: '🇸🇦' },
  { code: 'ja', label: 'Japanese', flag: '🇯🇵' },
  { code: 'hi', label: 'Hindi', flag: '🇮🇳' },
  { code: 'bn', label: 'Bengali', flag: '🇮🇳' },
  { code: 'te', label: 'Telugu', flag: '🇮🇳' },
  { code: 'mr', label: 'Marathi', flag: '🇮🇳' },
  { code: 'ta', label: 'Tamil', flag: '🇮🇳' },
  { code: 'gu', label: 'Gujarati', flag: '🇮🇳' },
  { code: 'kn', label: 'Kannada', flag: '🇮🇳' },
  { code: 'ml', label: 'Malayalam', flag: '🇮🇳' },
  { code: 'pa', label: 'Punjabi', flag: '🇮🇳' },
  { code: 'ur', label: 'Urdu', flag: '🇮🇳' }
];

export default function DocumentGenerator() {
  const { documents, loading: docsLoading, loadDocuments, deleteDocument } = useDocuments();
  const { templates, loadTemplates } = useTemplates();
  const { notification, showNotification } = useNotification();

  const [activeMode, setActiveMode] = useState('ai');
  const [editingDocument, setEditingDocument] = useState(null);
  const [pdfUrl, setPdfUrl] = useState(null);
  
  // Translation state
  const [activeDocTranslations, setActiveDocTranslations] = useState({});
  const [translateModalOpen, setTranslateModalOpen] = useState(false);
  const [translatePreview, setTranslatePreview] = useState(null);
  const [translateEnglish, setTranslateEnglish] = useState('');
  const [translateConfirmed, setTranslateConfirmed] = useState(false);
  const [currentDocIdForTranslate, setCurrentDocIdForTranslate] = useState(null);
  const [currentTranslateLang, setCurrentTranslateLang] = useState('es');
  const [translationIdSaved, setTranslationIdSaved] = useState(null);
  const [translating, setTranslating] = useState(false);

  useEffect(() => {
    loadDocuments();
    loadTemplates();
  }, [loadDocuments, loadTemplates]);

  const handleDocumentGenerated = () => {
    loadDocuments();
    showNotification('Document generated successfully!', 'success');
  };

  const handleDeleteDocument = async (docId) => {
    if (!window.confirm('Are you sure you want to delete this document?')) return;

    const result = await deleteDocument(docId);
    if (result.success) {
      showNotification('Document deleted', 'success');
      
      if (pdfUrl && pdfUrl.includes(`/documents/${docId}/`)) {
        setPdfUrl(null);
      }

      setActiveDocTranslations(prev => {
        const newState = { ...prev };
        delete newState[docId];
        return newState;
      });
    } else {
      showNotification(result.error || 'Failed to delete document', 'error');
    }
  };

  const handleTranslateRequest = async (docId, lang) => {
    setTranslating(true);
    setTranslateConfirmed(false);
    setTranslationIdSaved(null);
    setCurrentDocIdForTranslate(docId);
    setCurrentTranslateLang(lang);

    try {
      const { documentsAPI } = await import('../../services/api');
      
      const enResp = await documentsAPI.getContent(docId, 'en');
      let enText = '';
      if (enResp?.data) {
        if (typeof enResp.data === 'string') {
          enText = enResp.data;
        } else if (enResp.data.text) {
          enText = enResp.data.text;
        } else if (enResp.data.data && enResp.data.data.text) {
          enText = enResp.data.data.text;
        }
      }
      setTranslateEnglish(enText);

      const previewResp = await documentsAPI.translatePreview(docId, lang);
      const pData = previewResp?.data || previewResp;

      if (!pData?.success) {
        throw new Error(pData?.error || 'Preview failed');
      }

      setTranslatePreview({
        previewId: pData.previewId,
        translated: pData.translated,
        expiresAt: pData.expiresAt
      });

      setTranslateModalOpen(true);
      showNotification('Translation preview generated!', 'success');

    } catch (err) {
      showNotification('Translation failed: ' + (err.message || err), 'error');
    } finally {
      setTranslating(false);
    }
  };

  const handleTranslateConfirm = async () => {
    if (!translatePreview?.previewId) {
      return showNotification('No preview to confirm', 'error');
    }

    try {
      const { documentsAPI } = await import('../../services/api');
      const resp = await documentsAPI.translateConfirm(translatePreview.previewId);
      const data = resp?.data || resp;

      if (!data?.success) {
        throw new Error(data?.error || 'Confirm failed');
      }

      setTranslateConfirmed(true);
      setTranslationIdSaved(data.translationId || null);

      setActiveDocTranslations(prev => ({
        ...prev,
        [currentDocIdForTranslate]: {
          lang: currentTranslateLang,
          translationId: data.translationId
        }
      }));

      showNotification('Translation confirmed and saved!', 'success');

    } catch (err) {
      showNotification('Confirmation failed: ' + (err.message || err), 'error');
    }
  };

  const handleTranslateDownloadPdf = async (which) => {
    if (!currentDocIdForTranslate) return;

    if ((which === 'translated' || which === 'both') && !translateConfirmed) {
      return showNotification('Please confirm translation first!', 'error');
    }

    const body = {
      lang: which === 'both' ? 'both' : (which === 'en' ? 'en' : currentTranslateLang)
    };

    if (translationIdSaved) {
      body.translationId = translationIdSaved;
    }

    try {
      const { documentsAPI } = await import('../../services/api');
      const blobResp = await documentsAPI.generatePdf(currentDocIdForTranslate, body);
      const blob = blobResp.data || blobResp;

      const url = window.URL.createObjectURL(new Blob([blob], { type: 'application/pdf' }));
      const a = document.createElement('a');
      const nameSuffix = which === 'both' ? 'bilingual' : (which === 'en' ? 'en' : currentTranslateLang);
      a.href = url;
      a.download = `document_${currentDocIdForTranslate}_${nameSuffix}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);

      showNotification('PDF download started!', 'success');
    } catch (err) {
      showNotification('Download failed: ' + (err.message || err), 'error');
    }
  };

  const tabs = [
    {
      id: 'ai',
      label: 'Quick AI Generate',
      icon: <Sparkles size={18} />,
      content: (
        <AIDocumentForm
          onSuccess={handleDocumentGenerated}
          showNotification={showNotification}
        />
      )
    },
    {
      id: 'template',
      label: 'Use Template',
      icon: <FileText size={18} />,
      content: (
        <TemplateDocumentForm
          templates={templates}
          onSuccess={handleDocumentGenerated}
          showNotification={showNotification}
        />
      )
    }
  ];

  return (
    <div style={{ padding: '1.5rem' }}>
      <h1 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '1rem' }}>
        📄 Document Generator
      </h1>

      {notification && <Notification {...notification} />}

      <Tabs
        tabs={tabs}
        defaultTab={activeMode}
        onChange={setActiveMode}
      />

      <div style={{ marginTop: '2rem' }}>
        <DocumentList
          documents={documents}
          loading={docsLoading}
          languages={LANGUAGES}
          activeTranslations={activeDocTranslations}
          translating={translating}
          currentTranslatingId={currentDocIdForTranslate}
          onEdit={setEditingDocument}
          onDelete={handleDeleteDocument}
          onPreviewPDF={setPdfUrl}
          onTranslate={handleTranslateRequest}
        />
      </div>

      {editingDocument && (
        <DocumentEditor
          document={editingDocument}
          onClose={() => {
            setEditingDocument(null);
            loadDocuments();
          }}
          onSave={() => {
            setEditingDocument(null);
            loadDocuments();
          }}
        />
      )}

      {pdfUrl && (
        <div className="modal-overlay" onClick={() => setPdfUrl(null)}>
          <div 
            className="modal" 
            onClick={(e) => e.stopPropagation()} 
            style={{ maxWidth: '90vw', width: '1200px' }}
          >
            <div className="modal-header">
              <h3>PDF Preview</h3>
              <button onClick={() => setPdfUrl(null)} className="btn-close-modal">
                ×
              </button>
            </div>
            <div className="modal-body" style={{ padding: 0 }}>
              <PDFViewer pdfUrl={pdfUrl} />
            </div>
          </div>
        </div>
      )}

      <TranslateModal
        open={translateModalOpen}
        onClose={() => {
          setTranslateModalOpen(false);
          setTranslatePreview(null);
          setTranslateConfirmed(false);
          setTranslationIdSaved(null);
        }}
        english={translateEnglish}
        translated={translatePreview?.translated || ''}
        lang={currentTranslateLang}
        confirmed={translateConfirmed}
        onConfirm={handleTranslateConfirm}
        onDownload={handleTranslateDownloadPdf}
      />
    </div>
  );
}