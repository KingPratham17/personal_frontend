export const LANGUAGES = [
  { code: 'es', label: 'Spanish', flag: '🇪🇸' },
  { code: 'fr', label: 'French', flag: '🇫🇷' },
  { code: 'de', label: 'German', flag: '🇩🇪' },
  { code: 'pt', label: 'Portuguese', flag: '🇵🇹' },
  { code: 'zh', label: 'Chinese', flag: '🇨🇳' },
  { code: 'ru', label: 'Russian', flag: '🇷🇺' },
  { code: 'ar', label: 'Arabic', flag: '🇸🇦' },
  { code: 'ja', label: 'Japanese', flag: '🇯🇵' },
  { code: 'hi', label: 'Hindi', flag: '🇮🇳' },
  { code: 'bn', label: 'Bengali', flag: '🇮🇳' },
  { code: 'te', label: 'Telugu', flag: '🇮🇳' },
  { code: 'mr', label: 'Marathi', flag: '🇮🇳' },
  { code: 'ta', label: 'Tamil', flag: '🇮🇳' },
  { code: 'gu', label: 'Gujarati', flag: '🇮🇳' },
  { code: 'kn', label: 'Kannada', flag: '🇮🇳' },
  { code: 'ml', label: 'Malayalam', flag: '🇮🇳' },
  { code: 'pa', label: 'Punjabi', flag: '🇮🇳' },
  { code: 'ur', label: 'Urdu', flag: '🇮🇳' }
];

export const CLAUSE_TYPES = {
  NORMAL: 'normal',
  MERGED: 'merged',
  SAMPLE: 'sample',
  AI_GENERATED: 'ai_generated'
};

export const DOCUMENT_TYPES = [
  'offer_letter',
  'nda',
  'contract',
  'agreement',
  'employment_contract',
  'service_agreement',
  'general'
];

export const NOTIFICATION_DURATION = 4000;

export const TEMPLATE_TYPES = {
  MANUAL: 'manual',
  AI_GENERATED: 'ai_generated'
};

export const API_ENDPOINTS = {
  CLAUSES: '/clauses',
  TEMPLATES: '/templates',
  DOCUMENTS: '/documents',
  PDF: '/pdf',
  TRANSLATE: '/translate'
};

export const FILE_TYPES = {
  EXCEL: {
    MIME_TYPES: [
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-excel'
    ],
    EXTENSIONS: ['.xlsx', '.xls']
  },
  PDF: {
    MIME_TYPE: 'application/pdf',
    EXTENSION: '.pdf'
  }
};

export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
export const MAX_BULK_DOCUMENTS = 100;

export const PLACEHOLDER_REGEX = /\[([^\]]+)\]/g;

export const DATE_FORMAT = 'YYYY-MM-DD';
export const DATETIME_FORMAT = 'YYYY-MM-DD HH:mm:ss';