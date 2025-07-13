import type { LanguagePattern } from '../types';

/**
 * Special patterns for script tag content detection
 * These are used internally for context switching
 */
export const scriptContentPatterns = {
  // Pattern to find script tag content boundaries
  scriptTagContent: /<script\b[^>]*>([\s\S]*?)<\/script>/gi,
  // Pattern to extract just the opening script tag
  scriptTagOpen: /<script\b[^>]*>/gi,
  // Pattern to find the closing script tag
  scriptTagClose: /<\/script>/gi,
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

  // Attribute values (quoted strings) - enhanced to handle nested quotes
  // Double quotes have higher priority to capture full attribute values
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

  // Script tags (opening and closing) - handle these specially
  {
    name: 'script-tag-open',
    regex: /<script\b[^>]*>/gi,
    type: 'tag',
  },

  {
    name: 'script-tag-close',
    regex: /<\/script>/gi,
    type: 'tag',
  },

  // Complete HTML tags (for non-script tags)
  {
    name: 'html-tag-complete',
    regex: /<\/?(?!script\b)[a-zA-Z][a-zA-Z0-9:_-]*(?:\s+[^>]*)?\s*\/?>/gi,
    type: 'tag',
  },
];
