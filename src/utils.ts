import type { Language } from './types';

/**
 * Escape HTML special characters - optimized for size
 */
export function escapeHtml(text: string): string {
  if (!text) return '';
  return String(text).replace(/[<>&"']/g, (c) =>
    c === '<'
      ? '&lt;'
      : c === '>'
        ? '&gt;'
        : c === '&'
          ? '&amp;'
          : c === '"'
            ? '&quot;'
            : '&#39;'
  );
}

/**
 * Detect language - simplified
 */
export function detectLanguage(code: string): Language {
  return code && /<[a-zA-Z!?\/]/.test(code) ? 'html' : 'js';
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
