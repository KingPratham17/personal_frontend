import React from 'react';
import { Loading, EmptyState } from '../common';
import { DocumentCard } from './DocumentCard';
import { FileText } from 'lucide-react';

export function DocumentList({
  documents,
  loading,
  languages,
  activeTranslations,
  translating,
  currentTranslatingId,
  onEdit,
  onDelete,
  onPreviewPDF,
  onTranslate
}) {
  if (loading) {
    return <Loading text="Loading documents..." />;
  }

  if (documents.length === 0) {
    return (
      <EmptyState
        icon={FileText}
        title="No documents yet"
        message="Generate your first document to get started"
      />
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
      {documents.map((doc) => (
        <DocumentCard
          key={doc.id}
          document={doc}
          languages={languages}
          hasTranslation={activeTranslations[doc.id]}
          translating={translating && currentTranslatingId === doc.id}
          onEdit={onEdit}
          onDelete={onDelete}
          onPreviewPDF={onPreviewPDF}
          onTranslate={onTranslate}
        />
      ))}
    </div>
  );
}