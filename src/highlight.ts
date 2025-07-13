import type {
  HighlightOptions,
  Language,
  Token,
  CompiledPatterns,
} from './types';
import { detectLanguage, escapeHtml, wrapToken } from './utils';
import { javascriptPatterns } from './patterns/javascript';
import { htmlPatterns } from './patterns/html';

/**
 * Cached compiled patterns to avoid recompilation
 */
let compiledPatterns: CompiledPatterns | null = null;

/**
 * Get compiled patterns with caching
 */
function getCompiledPatterns(): CompiledPatterns {
  if (!compiledPatterns) {
    compiledPatterns = {
      js: javascriptPatterns,
      html: htmlPatterns,
    };
  }
  return compiledPatterns;
}

/**
 * Tokenize code using language-specific patterns
 * @param code - Source code to tokenize
 * @param language - Language to use for tokenization
 * @returns Array of tokens with position information
 */
function tokenize(code: string, language: Language): Token[] {
  const patterns = getCompiledPatterns();
  const languagePatterns = patterns[language];
  const tokens: Token[] = [];
  const processed = new Set<number>();

  // Process each pattern
  for (const pattern of languagePatterns) {
    const regex = new RegExp(pattern.regex.source, pattern.regex.flags);
    let match: RegExpExecArray | null;

    while ((match = regex.exec(code)) !== null) {
      const start = match.index;
      const end = start + match[0].length;

      // Skip if this range was already processed by a higher-priority pattern
      let overlap = false;
      for (let i = start; i < end; i++) {
        if (processed.has(i)) {
          overlap = true;
          break;
        }
      }

      if (!overlap) {
        tokens.push({
          type: pattern.type,
          value: match[0],
          start,
          end,
        });

        // Mark this range as processed
        for (let i = start; i < end; i++) {
          processed.add(i);
        }
      }

      // Prevent infinite loops
      if (regex.lastIndex === start) {
        regex.lastIndex++;
      }
    }
  }

  // Sort tokens by start position
  return tokens.sort((a, b) => a.start - b.start);
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
 * Highlight source code with syntax highlighting
 * @param code - Source code to highlight
 * @param options - Highlighting options
 * @returns HTML string with syntax highlighting
 */
export function highlight(
  code: string,
  options: HighlightOptions = {}
): string {
  try {
    // Handle empty or invalid input
    if (!code || typeof code !== 'string') {
      return '';
    }

    // Determine language
    const language = options.language || detectLanguage(code);

    // Tokenize the code
    const tokens = tokenize(code, language);

    // Convert to highlighted HTML
    return tokensToHtml(code, tokens);
  } catch (error) {
    // Never throw - return original code on any error
    return escapeHtml(code);
  }
}
