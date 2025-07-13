import type { LanguagePattern } from '../types';

/**
 * HTML language patterns for tokenization
 * Ordered by priority - more specific patterns should come first
 */
export const htmlPatterns: LanguagePattern[] = [
  // HTML comments
  {
    name: 'html-comment',
    regex: /<!--[\s\S]*?-->/g,
    type: 'comment',
  },

  // Attribute values (quoted strings)
  {
    name: 'attr-value-double',
    regex: /"[^"]*"/g,
    type: 'attr-value',
  },

  {
    name: 'attr-value-single',
    regex: /'[^']*'/g,
    type: 'attr-value',
  },

  // Attribute names (within tags)
  {
    name: 'attr-name',
    regex: /\b[a-zA-Z-]+(?=\s*=)/g,
    type: 'attr-name',
  },

  // HTML tags (opening, closing, self-closing)
  {
    name: 'html-tag',
    regex: /<\/?[a-zA-Z][a-zA-Z0-9]*[^>]*>/g,
    type: 'tag',
  },
];
