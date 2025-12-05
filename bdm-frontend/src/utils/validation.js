export function validateClause(data) {
  const errors = {};
  
  if (!data.clause_type?.trim()) {
    errors.clause_type = 'Clause type is required';
  }
  
  if (!data.content?.trim()) {
    errors.content = 'Content is required';
  }
  
  if (!data.category?.trim()) {
    errors.category = 'Category is required';
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
  
  return errors;
}

export function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

export function validateRequired(value) {
  return value && value.trim().length > 0;
}
