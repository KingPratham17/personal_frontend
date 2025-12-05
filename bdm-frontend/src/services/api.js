import axios from 'axios';

// Base configuration - UPDATE THIS URL to match your backend
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('bdm_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('bdm_token');
      // Optional: Redirect to login
    }
    return Promise.reject(error);
  }
);

// ============================================
// CLAUSES API
// ============================================
export const clausesAPI = {
  getAll: (params) => api.get('/clauses', { params }),
  getById: (id) => api.get(`/clauses/${id}`),
  createManual: (data) => api.post('/clauses/manual', data),
  update: (id, data) => api.put(`/clauses/${id}`, data),
  delete: (id) => api.delete(`/clauses/${id}`),
  
  // AI Generation
  generateAI: (data) => api.post('/clauses/generate-ai', data),
  generateSingleAI: (data) => api.post('/clauses/generate-single-ai', data),
  
  // Merge & Sample
  mergeClauses: (data) => api.post('/clauses/merge', data),
  markAsSample: (id, isSample) => api.patch(`/clauses/${id}/sample`, { is_sample: isSample }),
  cloneSample: (id, data) => api.post(`/clauses/${id}/clone`, data),
};

// ============================================
// TEMPLATES API
// ============================================
export const templatesAPI = {
  getAll: (params) => api.get('/templates', { params }),
  getById: (id) => api.get(`/templates/${id}`),
  createManual: (data) => api.post('/templates/manual', data),
  update: (id, data) => api.put(`/templates/${id}`, data),
  delete: (id) => api.delete(`/templates/${id}`),
  
  // AI Generation
  generateAIComplete: (data) => api.post('/templates/generate-ai', data),
};

// ============================================
// DOCUMENTS API
// ============================================
export const documentsAPI = {
  getAll: (params) => api.get('/documents', { params }),
  getById: (id) => api.get(`/documents/${id}`),
  generate: (data) => api.post('/documents/generate', data),
  update: (id, data) => api.put(`/documents/${id}`, data),
  delete: (id) => api.delete(`/documents/${id}`),
  
  // Content & Translation
  getContent: (id, lang = 'en') => api.get(`/documents/${id}/content`, { params: { lang } }),
  translatePreview: (id, lang) => api.post(`/documents/${id}/translate/preview`, { target_language: lang }),
  translateConfirm: (previewId) => api.post(`/translations/confirm/${previewId}`),
  
  // PDF Operations
  generatePdf: (id, data) => api.post(`/documents/${id}/pdf`, data, { responseType: 'blob' }),
  
  // Bulk Operations
  bulkGenerateFromExcel: (templateId, file) => {
    const formData = new FormData();
    formData.append('excel_file', file);
    return api.post(`/documents/bulk-generate/${templateId}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      responseType: 'blob',
    });
  },
  
  aiBulkGenerateFromExcel: (documentType, file) => {
    const formData = new FormData();
    formData.append('excel_file', file);
    formData.append('document_type', documentType);
    return api.post('/documents/ai-bulk-generate', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      responseType: 'blob',
    });
  },
};

// ============================================
// PDF API

export const pdfAPI = {
  getPreviewUrl: (docId) => `${API_BASE_URL}/documents/${docId}/preview`,
  download: async (docId, filename) => {
    try {
      const response = await api.get(`/documents/${docId}/download`, {
        responseType: 'blob',
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.download = `${filename || 'document'}.pdf`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },
};

export default api;
