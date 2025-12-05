import { useState, useCallback, useEffect } from 'react';
import { templatesAPI } from '../services/api';

export function useTemplates(autoLoad = false) {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadTemplates = useCallback(async (params = {}) => {
    try {
      setLoading(true);
      setError(null);
      const res = await templatesAPI.getAll(params);
      setTemplates(res?.data?.data || []);
      return { success: true, data: res?.data?.data };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, []);

  const getTemplateById = useCallback(async (id) => {
    try {
      const res = await templatesAPI.getById(id);
      return { success: true, data: res.data.data };
    } catch (err) {
      return { success: false, error: err.message };
    }
  }, []);

  const createTemplate = useCallback(async (data) => {
    try {
      const res = await templatesAPI.createManual(data);
      await loadTemplates();
      return { success: true, data: res.data };
    } catch (err) {
      return { success: false, error: err.message };
    }
  }, [loadTemplates]);

  const updateTemplate = useCallback(async (id, data) => {
    try {
      const res = await templatesAPI.update(id, data);
      await loadTemplates();
      return { success: true, data: res.data };
    } catch (err) {
      return { success: false, error: err.message };
    }
  }, [loadTemplates]);

  const deleteTemplate = useCallback(async (id) => {
    try {
      await templatesAPI.delete(id);
      await loadTemplates();
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  }, [loadTemplates]);

  const generateAITemplate = useCallback(async (data) => {
    try {
      const res = await templatesAPI.generateAIComplete(data);
      await loadTemplates();
      return { success: true, data: res.data };
    } catch (err) {
      return { success: false, error: err.message };
    }
  }, [loadTemplates]);

  useEffect(() => {
    if (autoLoad) {
      loadTemplates();
    }
  }, [autoLoad, loadTemplates]);

  return {
    templates,
    loading,
    error,
    loadTemplates,
    getTemplateById,
    createTemplate,
    updateTemplate,
    deleteTemplate,
    generateAITemplate
  };
}
