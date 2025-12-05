import { MAX_FILE_SIZE, FILE_TYPES } from './constants';

export function validateClause(data) {
  const errors = {};
  
  if (!data.clause_type?.trim()) {
    errors.clause_type = 'Clause type is required';
  }
  
  if (!data.content?.trim() && !data.content_html?.trim()) {
    errors.content = 'Content is required';
  }
  
  if (!data.category?.trim()) {
    errors.category = 'Category is required';
  }
  
  if (data.clause_type && data.clause_type.length > 200) {
    errors.clause_type = 'Clause type must be less than 200 characters';
  }
  
  return errors;
}

export function validateTemplate(data) {
  const errors = {};
  
  if (!data.template_name?.trim()) {
    errors.template_name = 'Template name is required';
  }
  
  if (!data.document_type?.trim()) {
    errors.document_type = 'Document type is required';
  }
  
  if (!data.clause_ids || data.clause_ids.length === 0) {
    errors.clause_ids = 'At least one clause is required';
  }
  
  if (data.template_name && data.template_name.length > 200) {
    errors.template_name = 'Template name must be less than 200 characters';
  }
  
  return errors;
}

export function validateDocument(data) {
  const errors = {};
  
  if (!data.document_name?.trim()) {
    errors.document_name = 'Document name is required';
  }
  
  if (!data.document_type?.trim()) {
    errors.document_type = 'Document type is required';
  }
  
  if (data.document_name && data.document_name.length > 200) {
    errors.document_name = 'Document name must be less than 200 characters';
  }
  
  return errors;
}

export function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

export function validateRequired(value) {
  return value && value.trim().length > 0;
}

export function validateFile(file, fileType = 'EXCEL') {
  const errors = [];
  
  if (!file) {
    errors.push('No file selected');
    return errors;
  }
  
  // Check file size
  if (file.size > MAX_FILE_SIZE) {
    errors.push(`File size must be less than ${MAX_FILE_SIZE / (1024 * 1024)}MB`);
  }
  
  // Check file type
  const allowedTypes = FILE_TYPES[fileType];
  if (allowedTypes) {
    const fileExtension = '.' + file.name.split('.').pop().toLowerCase();
    const isValidType = allowedTypes.MIME_TYPES?.includes(file.type) || 
                       allowedTypes.EXTENSIONS?.includes(fileExtension);
    
    if (!isValidType) {
      errors.push(`Invalid file type. Allowed: ${allowedTypes.EXTENSIONS.join(', ')}`);
    }
  }
  
  return errors;
}

export function validatePlaceholders(placeholders, values) {
  const errors = {};
  
  placeholders.forEach(placeholder => {
    if (!values[placeholder] || values[placeholder].trim() === '') {
      errors[placeholder] = 'This field is required';
    }
  });
  
  return errors;
}

export function validateJSON(jsonString) {
  try {
    JSON.parse(jsonString);
    return { valid: true, error: null };
  } catch (error) {
    return { valid: false, error: error.message };
  }
}

export function validateURL(url) {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

export function validatePhoneNumber(phone) {
  // Basic phone validation (can be customized based on region)
  const re = /^[\d\s\-\+\(\)]+$/;
  return re.test(phone) && phone.replace(/\D/g, '').length >= 10;
}

export function validateDateRange(startDate, endDate) {
  if (!startDate || !endDate) return true;
  return new Date(startDate) <= new Date(endDate);
}