import { PLACEHOLDER_REGEX } from './constants';

export function formatDate(date, format = 'default') {
  if (!date) return '';
  
  const d = new Date(date);
  
  if (isNaN(d.getTime())) return '';
  
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  
  switch (format) {
    case 'short':
      return `${month}/${day}/${year}`;
    case 'long':
      return d.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });
    case 'iso':
      return d.toISOString().split('T')[0];
    default:
      return d.toLocaleDateString();
  }
}

export function formatDateTime(date) {
  if (!date) return '';
  
  const d = new Date(date);
  if (isNaN(d.getTime())) return '';
  
  return d.toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

export function truncateText(text, length = 200) {
  if (!text) return '';
  if (text.length <= length) return text;
  return text.substring(0, length) + '...';
}

export function extractPlaceholders(text) {
  if (!text) return [];
  const matches = text.match(PLACEHOLDER_REGEX);
  if (!matches) return [];
  return [...new Set(matches.map(m => m.substring(1, m.length - 1).trim()))];
}

export function fillPlaceholders(text, values) {
  if (!text) return '';
  let result = text;
  
  Object.keys(values).forEach(placeholder => {
    const value = values[placeholder] || `[${placeholder}]`;
    const escapedPlaceholder = placeholder.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
    result = result.replace(new RegExp(`\\[${escapedPlaceholder}\\]`, 'g'), value);
  });
  
  return result;
}

export function stripHtmlTags(html) {
  if (!html) return '';
  const tmp = document.createElement('div');
  tmp.innerHTML = html;
  return tmp.textContent || tmp.innerText || '';
}

export function formatFileSize(bytes) {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}

export function formatNumber(num, decimals = 0) {
  if (isNaN(num)) return '0';
  return Number(num).toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  });
}

export function formatCurrency(amount, currency = 'USD') {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency
  }).format(amount);
}

export function capitalizeFirst(str) {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function camelToTitle(str) {
  if (!str) return '';
  return str
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, str => str.toUpperCase())
    .trim();
}

export function sanitizeFileName(fileName) {
  return fileName.replace(/[^a-z0-9_\-\.]/gi, '_');
}

export function generateUniqueId() {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

export function formatRelativeTime(date) {
  if (!date) return '';
  
  const now = new Date();
  const then = new Date(date);
  const seconds = Math.floor((now - then) / 1000);
  
  if (seconds < 60) return 'just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)} minutes ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`;
  if (seconds < 604800) return `${Math.floor(seconds / 86400)} days ago`;
  
  return formatDate(date);
}

export function parseTemplateVariables(template) {
  const variables = extractPlaceholders(template);
  return variables.map(v => ({
    name: v,
    label: camelToTitle(v),
    required: true,
    type: inferVariableType(v)
  }));
}

function inferVariableType(variableName) {
  const lower = variableName.toLowerCase();
  
  if (lower.includes('date')) return 'date';
  if (lower.includes('email')) return 'email';
  if (lower.includes('phone')) return 'tel';
  if (lower.includes('amount') || lower.includes('salary') || lower.includes('price')) return 'number';
  if (lower.includes('signature')) return 'signature';
  
  return 'text';
}