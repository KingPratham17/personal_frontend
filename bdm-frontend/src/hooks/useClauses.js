import { useState, useCallback, useEffect } from 'react';
import { clausesAPI } from '../services/api';

export function useClauses(autoLoad = false) {
  const [clauses, setClauses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadClauses = useCallback(async (params = {}) => {
    try {
      setLoading(true);
      setError(null);
      const response = await clausesAPI.getAll(params);
      setClauses(response.data.data || []);
      return { success: true, data: response.data.data };
    } catch (err) {
      setError(err.message);
      console.error('Failed to fetch clauses:', err);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, []);

  const createClause = useCallback(async (data) => {
    try {
      const response = await clausesAPI.createManual(data);
      await loadClauses();
      return { success: true, data: response.data };
    } catch (err) {
      return { success: false, error: err.message };
    }
  }, [loadClauses]);

  const updateClause = useCallback(async (id, data) => {
    try {
      const response = await clausesAPI.update(id, data);
      await loadClauses();
      return { success: true, data: response.data };
    } catch (err) {
      return { success: false, error: err.message };
    }
  }, [loadClauses]);

  const deleteClause = useCallback(async (id) => {
    try {
      await clausesAPI.delete(id);
      setClauses(prev => prev.filter(c => c.id !== id));
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  }, []);

  const mergeClauses = useCallback(async (payload) => {
    try {
      const response = await clausesAPI.mergeClauses(payload);
      await loadClauses();
      return { success: true, data: response.data };
    } catch (err) {
      return { success: false, error: err.message };
    }
  }, [loadClauses]);

  const toggleSample = useCallback(async (id, isSample) => {
    try {
      await clausesAPI.markAsSample(id, isSample);
      await loadClauses();
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  }, [loadClauses]);

  const cloneSample = useCallback(async (id, data) => {
    try {
      await clausesAPI.cloneSample(id, data);
      await loadClauses();
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  }, [loadClauses]);

  const generateAI = useCallback(async (data) => {
    try {
      const response = await clausesAPI.generateAI(data);
      return { success: true, data: response.data.data };
    } catch (err) {
      return { success: false, error: err.message };
    }
  }, []);

  const generateSingleAI = useCallback(async (data) => {
    try {
      const response = await clausesAPI.generateSingleAI(data);
      await loadClauses();
      return { success: true, data: response.data };
    } catch (err) {
      return { success: false, error: err.message };
    }
  }, [loadClauses]);

  useEffect(() => {
    if (autoLoad) {
      loadClauses();
    }
  }, [autoLoad, loadClauses]);

  return {
    clauses,
    loading,
    error,
    loadClauses,
    createClause,
    updateClause,
    deleteClause,
    mergeClauses,
    toggleSample,
    cloneSample,
    generateAI,
    generateSingleAI
  };
}