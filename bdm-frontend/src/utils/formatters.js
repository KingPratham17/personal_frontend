export function formatDate(date) {
  return new Date(date).toLocaleDateString();
}

export function truncateText(text, length = 200) {
  if (!text) return '';
  if (text.length <= length) return text;
  return text.substring(0, length) + '...';
}

export function extractPlaceholders(text) {
  if (!text) return [];
  const matches = text.match(/\[([^\]]+)\]/g);
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