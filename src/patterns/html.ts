import type { LanguagePattern } from '../types';

/**
 * Script tag patterns - optimized for size
 */
export const scriptContentPatterns = {
  scriptTagContent: /<script\b[^>]*>([\s\S]*?)<\/script>/gi,
  scriptTagOpen: /<script\b[^>]*>/gi,
};

/**
 * HTML language patterns for tokenization
 * Ordered by priority - more specific patterns should come first
 * Phase 4: Enhanced patterns with better edge case handling
 */
export const htmlPatterns: LanguagePattern[] = [
  // HTML comments - enhanced to handle edge cases (highest priority)
  {
    name: 'html-comment',
    regex: /<!--[\s\S]*?-->/g,
    type: 'comment',
  },

  // Attribute values - separate patterns for better matching
  {
    name: 'attr-value-double',
    regex: /"(?:[^"\\]|\\.)*"/g,
    type: 'attr-value',
  },
  {
    name: 'attr-value-single',
    regex: /'(?:[^'\\]|\\.)*'/g,
    type: 'attr-value',
  },

  // Attribute names - must come before tags but after attribute values
  {
    name: 'attr-name',
    regex: /\b[a-zA-Z][a-zA-Z0-9:_-]*(?=\s*=)/g,
    type: 'attr-name',
  },

  // HTML tags - simplified and combined
  {
    name: 'tag',
    regex: /<\/?[a-zA-Z][\w:_-]*[^>]*>/gi,
    type: 'tag',
  },
];
