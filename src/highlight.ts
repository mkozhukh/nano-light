import type { HighlightOptions, Language, Token } from './types';
import { detectLanguage, escapeHtml, wrapToken } from './utils';
import { javascriptPatterns } from './patterns/javascript';
import { htmlPatterns } from './patterns/html';

/**
 * Get language patterns directly - simplified for size
 */
function getPatterns(language: Language) {
  return language === 'html' ? htmlPatterns : javascriptPatterns;
}

/**
 * HTML tokenizer with script tag context switching
 */
function tokenizeHtml(code: string): Token[] {
  const tokens: Token[] = [];
  const processed = new Set<number>();

  // Find script tag content areas for context switching
  const scriptRegex = /<script\b[^>]*>([\s\S]*?)<\/script>/gi;
  const scriptAreas: Array<{
    start: number;
    end: number;
    content: string;
    contentStart: number;
  }> = [];

  let scriptMatch: RegExpExecArray | null;
  while ((scriptMatch = scriptRegex.exec(code)) !== null) {
    const fullMatch = scriptMatch[0];
    const content = scriptMatch[1];
    const matchStart = scriptMatch.index;
    const contentStart = matchStart + fullMatch.indexOf(content || '');

    scriptAreas.push({
      start: matchStart,
      end: matchStart + fullMatch.length,
      content: content || '',
      contentStart,
    });
  }

  // Process HTML patterns (avoiding script content)
  for (const pattern of htmlPatterns) {
    pattern.regex.lastIndex = 0;
    let match: RegExpExecArray | null;
    while ((match = pattern.regex.exec(code)) !== null) {
      const start = match.index;
      const end = start + match[0].length;

      // Skip if inside script content
      let inScriptContent = false;
      for (const scriptArea of scriptAreas) {
        if (
          start >= scriptArea.contentStart &&
          end <= scriptArea.contentStart + scriptArea.content.length
        ) {
          inScriptContent = true;
          break;
        }
      }

      if (
        !inScriptContent &&
        ![...Array(end - start)].some((_, i) => processed.has(start + i))
      ) {
        tokens.push({ type: pattern.type, value: match[0], start, end });
        for (let i = start; i < end; i++) processed.add(i);
      }
    }
  }

  // Process JavaScript content in script tags
  for (const scriptArea of scriptAreas) {
    if (scriptArea.content.trim()) {
      const jsTokens = tokenizeCode(scriptArea.content, 'js');

      for (const token of jsTokens) {
        const adjustedStart = token.start + scriptArea.contentStart;
        const adjustedEnd = token.end + scriptArea.contentStart;

        if (
          ![...Array(adjustedEnd - adjustedStart)].some((_, i) =>
            processed.has(adjustedStart + i)
          )
        ) {
          tokens.push({
            ...token,
            start: adjustedStart,
            end: adjustedEnd,
          });
          for (let i = adjustedStart; i < adjustedEnd; i++) processed.add(i);
        }
      }
    }
  }

  return tokens.sort((a, b) => a.start - b.start);
}

/**
 * Tokenize code - simplified unified tokenizer
 */
function tokenizeCode(code: string, language: Language): Token[] {
  const tokens: Token[] = [];
  const processed = new Set<number>();
  const patterns = getPatterns(language);

  for (const pattern of patterns) {
    pattern.regex.lastIndex = 0;
    let match: RegExpExecArray | null;

    while ((match = pattern.regex.exec(code)) !== null) {
      const start = match.index;
      const end = start + match[0].length;

      if (![...Array(end - start)].some((_, i) => processed.has(start + i))) {
        tokens.push({ type: pattern.type, value: match[0], start, end });
        for (let i = start; i < end; i++) processed.add(i);
      }
    }
  }

  return tokens.sort((a, b) => a.start - b.start);
}

/**
 * Main tokenizer function
 */
function tokenize(code: string, language: Language): Token[] {
  return language === 'html'
    ? tokenizeHtml(code)
    : tokenizeCode(code, language);
}

/**
 * Convert tokens to highlighted HTML
 * @param code - Original source code
 * @param tokens - Array of tokens
 * @returns HTML string with syntax highlighting
 */
function tokensToHtml(code: string, tokens: Token[]): string {
  if (tokens.length === 0) {
    return escapeHtml(code);
  }

  let result = '';
  let lastEnd = 0;

  for (const token of tokens) {
    // Add any unprocessed text before this token
    if (token.start > lastEnd) {
      const unprocessed = code.slice(lastEnd, token.start);
      result += escapeHtml(unprocessed);
    }

    // Add the highlighted token
    const escapedValue = escapeHtml(token.value);
    result += wrapToken(escapedValue, token.type);

    lastEnd = token.end;
  }

  // Add any remaining unprocessed text
  if (lastEnd < code.length) {
    const remaining = code.slice(lastEnd);
    result += escapeHtml(remaining);
  }

  return result;
}

/**
 * Highlight source code with syntax highlighting for JavaScript and HTML.
 *
 * This function provides robust syntax highlighting with automatic language detection.
 * It never throws exceptions and gracefully handles malformed input by returning
 * the original escaped code on any failure.
 *
 * @example
 * ```typescript
 * // Auto-detect language
 * const highlighted = highlight('function test() { return "hello"; }');
 *
 * // Force specific language
 * const htmlHighlighted = highlight('<div>Hello</div>', { language: 'html' });
 * ```
 *
 * @param code - Source code to highlight. Must be a string.
 * @param options - Optional highlighting configuration
 * @param options.language - Force specific language detection ('js' | 'html').
 *                          If not provided, language will be auto-detected.
 * @returns HTML string with syntax highlighting wrapped in <span> elements with CSS classes.
 *          Returns empty string for null/undefined input.
 *          Returns escaped original code on any processing errors.
 *
 * @public
 */
export function highlight(
  code: string,
  options: HighlightOptions = {}
): string {
  try {
    // Robust input validation
    if (code === null || code === undefined) {
      return '';
    }

    // Convert non-string input to string (for robustness)
    if (typeof code !== 'string') {
      code = String(code);
    }

    // Handle empty string case
    if (code === '') {
      return '';
    }

    // Validate and normalize options
    let language: Language;

    // Validate language option if provided
    if (
      options?.language &&
      options.language !== 'js' &&
      options.language !== 'html'
    ) {
      // Invalid language - fall back to auto-detection
      language = detectLanguage(code);
    } else {
      // Use provided language or auto-detect
      language = options?.language || detectLanguage(code);
    }

    // Tokenize the code with error boundary
    const tokens = tokenize(code, language);

    // Convert to highlighted HTML with error boundary
    return tokensToHtml(code, tokens);
  } catch (error) {
    // Never throw - return escaped original code on any error
    // This ensures the function is completely safe to use
    if (typeof code === 'string') {
      return escapeHtml(code);
    }
    return '';
  }
}
