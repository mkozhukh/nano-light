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
 * The patterns are pre-compiled and cached for optimal performance
 */
let compiledPatterns: CompiledPatterns | null = null;

/**
 * Cache for compiled regex patterns to avoid recreating RegExp objects
 * Key format: `${language}-${patternName}`
 */
const regexCache = new Map<string, RegExp>();

/**
 * Get compiled patterns with lazy initialization and caching
 * This ensures patterns are only compiled once and reused across calls
 */
function getCompiledPatterns(): CompiledPatterns {
  if (!compiledPatterns) {
    compiledPatterns = {
      js: javascriptPatterns,
      html: htmlPatterns,
    };

    // Pre-compile and cache regex patterns for better performance
    for (const [language, patterns] of Object.entries(compiledPatterns)) {
      for (const pattern of patterns) {
        const cacheKey = `${language}-${pattern.name}`;
        if (!regexCache.has(cacheKey)) {
          // Create a new RegExp with global flag to ensure proper matching
          regexCache.set(cacheKey, new RegExp(pattern.regex.source, 'g'));
        }
      }
    }
  }
  return compiledPatterns;
}

/**
 * Get a cached regex pattern for optimal performance
 * @param language - Target language
 * @param patternName - Name of the pattern
 * @returns Cached RegExp object
 */
function getCachedRegex(language: Language, patternName: string): RegExp {
  const cacheKey = `${language}-${patternName}`;
  const cached = regexCache.get(cacheKey);

  if (cached) {
    // Reset lastIndex to ensure consistent behavior
    cached.lastIndex = 0;
    return cached;
  }

  // Fallback: create new regex if not found in cache
  const patterns = getCompiledPatterns()[language];
  const pattern = patterns.find((p) => p.name === patternName);
  if (pattern) {
    const regex = new RegExp(pattern.regex.source, 'g');
    regexCache.set(cacheKey, regex);
    return regex;
  }

  throw new Error(`Pattern not found: ${language}-${patternName}`);
}

/**
 * Tokenize code using language-specific patterns with optimized caching
 * @param code - Source code to tokenize
 * @param language - Language to use for tokenization
 * @returns Array of tokens with position information
 */
function tokenize(code: string, language: Language): Token[] {
  const patterns = getCompiledPatterns();
  const languagePatterns = patterns[language];
  const tokens: Token[] = [];
  const processed = new Set<number>();

  // Process each pattern using cached regex objects
  for (const pattern of languagePatterns) {
    const regex = getCachedRegex(language, pattern.name);
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

      // Prevent infinite loops on zero-length matches
      if (regex.lastIndex === start) {
        regex.lastIndex++;
      }
    }
  }

  // Sort tokens by start position for proper rendering order
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
