import type { Language } from './types';

/**
 * HTML entities for escaping special characters
 * Uses the most standard/compatible entity codes
 */
const HTML_ENTITIES: Record<string, string> = {
  '<': '&lt;',
  '>': '&gt;',
  '&': '&amp;',
  '"': '&quot;',
  "'": '&#39;',
} as const;

/**
 * Escape HTML special characters in text while preserving token boundaries
 * This function ensures that all potentially dangerous HTML characters are escaped
 * while maintaining the exact length relationships needed for token positioning
 *
 * @param text - Text to escape
 * @returns Escaped text safe for HTML insertion
 */
export function escapeHtml(text: string): string {
  // Handle null/undefined input gracefully
  if (text == null) {
    return '';
  }

  // Convert to string if needed
  if (typeof text !== 'string') {
    text = String(text);
  }

  // Replace all HTML special characters with their entity equivalents
  return text.replace(/[<>&"']/g, (char) => HTML_ENTITIES[char] || char);
}

/**
 * Detect language from code content using simple heuristics
 * @param code - Source code to analyze
 * @returns Detected language
 */
export function detectLanguage(code: string): Language {
  // Handle empty or whitespace-only input
  if (!code || !code.trim()) {
    return 'js'; // Default to JavaScript for empty input
  }

  // HTML indicators: look for < followed by letter, !, or ?
  // Also check for common HTML patterns like closing tags and DOCTYPE
  const htmlPatterns = [
    /<[a-zA-Z!?]/, // Opening tag, comment, or doctype
    /<\/[a-zA-Z]/, // Closing tag
    /<!DOCTYPE/i, // DOCTYPE declaration
    /<!--/, // HTML comment start
  ];

  if (htmlPatterns.some((pattern) => pattern.test(code))) {
    return 'html';
  }

  // Default to JavaScript for all other cases
  return 'js';
}

/**
 * Wrap a token value in appropriate HTML span element
 * @param value - Token value (already HTML-escaped)
 * @param type - Token type for CSS class
 * @returns HTML span element
 */
export function wrapToken(value: string, type: string): string {
  return `<span class="token ${type}">${value}</span>`;
}
