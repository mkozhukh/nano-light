import type { Language } from './types';

/**
 * HTML entities for escaping
 */
const HTML_ENTITIES: Record<string, string> = {
  '<': '&lt;',
  '>': '&gt;',
  '&': '&amp;',
  '"': '&quot;',
  "'": '&#39;',
};

/**
 * Escape HTML special characters in text
 * @param text - Text to escape
 * @returns Escaped text safe for HTML
 */
export function escapeHtml(text: string): string {
  return text.replace(/[<>&"']/g, (char) => HTML_ENTITIES[char] || char);
}

/**
 * Detect language from code content using simple heuristics
 * @param code - Source code to analyze
 * @returns Detected language
 */
export function detectLanguage(code: string): Language {
  // Simple heuristic: if code contains < followed by a letter or !, it's likely HTML
  if (/<[a-zA-Z!]/.test(code)) {
    return 'html';
  }

  // Default to JavaScript
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
