import { useState, useCallback, useEffect } from 'react';
import { documentsAPI } from '../services/api';

export function useDocuments(autoLoad = false) {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadDocuments = useCallback(async (params = {}) => {
    try {
      setLoading(true);
      setError(null);
      const res = await documentsAPI.getAll(params);
      setDocuments(res?.data?.data || []);
      return { success: true, data: res?.data?.data };
    } catch (err) {
      setError(err.message);
      console.error('Failed to load documents:', err);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, []);

  const getDocumentById = useCallback(async (id) => {
    try {
      const res = await documentsAPI.getById(id);
      return { success: true, data: res.data.data };
    } catch (err) {
      return { success: false, error: err.message };
    }
  }, []);

  const generateDocument = useCallback(async (data) => {
    try {
      const res = await documentsAPI.generate(data);
      await loadDocuments();
      return { success: true, data: res.data };
    } catch (err) {
      return { success: false, error: err.message };
    }
  }, [loadDocuments]);

  const updateDocument = useCallback(async (id, data) => {
    try {
      const res = await documentsAPI.update(id, data);
      await loadDocuments();
      return { success: true, data: res.data };
    } catch (err) {
      return { success: false, error: err.message };
    }
  }, [loadDocuments]);

  const deleteDocument = useCallback(async (id) => {
    try {
      await documentsAPI.delete(id);
      setDocuments(prev => prev.filter(d => d.id !== id));
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  }, []);

  const bulkGenerateFromExcel = useCallback(async (templateId, file) => {
    try {
      const response = await documentsAPI.bulkGenerateFromExcel(templateId, file);
      return { success: true, data: response.data };
    } catch (err) {
      return { success: false, error: err.message };
    }
  }, []);

  const aiBulkGenerateFromExcel = useCallback(async (documentType, file) => {
    try {
      const response = await documentsAPI.aiBulkGenerateFromExcel(documentType, file);
      return { success: true, data: response.data };
    } catch (err) {
      return { success: false, error: err.message };
    }
  }, []);

  useEffect(() => {
    if (autoLoad) {
      loadDocuments();
    }
  }, [autoLoad, loadDocuments]);

  return {
    documents,
    loading,
    error,
    loadDocuments,
    getDocumentById,
    generateDocument,
    updateDocument,
    deleteDocument,
    bulkGenerateFromExcel,
    aiBulkGenerateFromExcel
  };
}