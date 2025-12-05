import { useState, useCallback } from 'react';
import { documentsAPI } from '../services/api';

export function useTranslation() {
  const [translating, setTranslating] = useState(false);
  const [preview, setPreview] = useState(null);
  const [confirmed, setConfirmed] = useState(false);
  const [translationId, setTranslationId] = useState(null);

  const requestPreview = useCallback(async (documentId, lang) => {
    try {
      setTranslating(true);
      setConfirmed(false);
      setTranslationId(null);

      const res = await documentsAPI.translatePreview(documentId, lang);
      const data = res?.data || res;

      if (!data?.success) {
        throw new Error(data?.error || 'Preview failed');
      }

      setPreview({
        previewId: data.previewId,
        translated: data.translated,
        expiresAt: data.expiresAt,
        lang
      });

      return { success: true, preview: data };
    } catch (err) {
      return { success: false, error: err.message };
    } finally {
      setTranslating(false);
    }
  }, []);

  const confirmTranslation = useCallback(async () => {
    if (!preview?.previewId) {
      return { success: false, error: 'No preview to confirm' };
    }

    try {
      const res = await documentsAPI.translateConfirm(preview.previewId);
      const data = res?.data || res;

      if (!data?.success) {
        throw new Error(data?.error || 'Confirm failed');
      }

      setConfirmed(true);
      setTranslationId(data.translationId);
      return { success: true, translationId: data.translationId };
    } catch (err) {
      return { success: false, error: err.message };
    }
  }, [preview]);

  const getContent = useCallback(async (documentId, lang = 'en') => {
    try {
      const res = await documentsAPI.getContent(documentId, lang);
      return { success: true, data: res.data };
    } catch (err) {
      return { success: false, error: err.message };
    }
  }, []);

  const downloadPDF = useCallback(async (documentId, options = {}) => {
    try {
      const body = {
        lang: options.lang || 'en',
        ...(translationId && { translationId })
      };

      const response = await documentsAPI.generatePdf(documentId, body);
      return { success: true, data: response.data };
    } catch (err) {
      return { success: false, error: err.message };
    }
  }, [translationId]);

  const reset = useCallback(() => {
    setPreview(null);
    setConfirmed(false);
    setTranslating(false);
    setTranslationId(null);
  }, []);

  return {
    translating,
    preview,
    confirmed,
    translationId,
    requestPreview,
    confirmTranslation,
    getContent,
    downloadPDF,
    reset
  };
}