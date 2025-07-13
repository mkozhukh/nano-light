import type {
  HighlightOptions,
  Language,
  Token,
  CompiledPatterns,
} from './types';
import { detectLanguage, escapeHtml, wrapToken } from './utils';
import { javascriptPatterns } from './patterns/javascript';
import { htmlPatterns, scriptContentPatterns } from './patterns/html';

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
 * Tokenize HTML code with special handling for script tags
 * This function switches context to JavaScript when inside script tags
 * @param code - HTML source code to tokenize
 * @returns Array of tokens with position information
 */
function tokenizeHtml(code: string): Token[] {
  const tokens: Token[] = [];
  const processed = new Set<number>();

  // Step 1: Find and process script tag content areas
  const scriptContentRegex = new RegExp(
    scriptContentPatterns.scriptTagContent.source,
    'gi'
  );
  const scriptAreas: Array<{
    start: number;
    end: number;
    content: string;
    openTagEnd: number;
    closeTagStart: number;
  }> = [];

  let scriptMatch: RegExpExecArray | null;
  while ((scriptMatch = scriptContentRegex.exec(code)) !== null) {
    const fullMatch = scriptMatch[0];
    const content = scriptMatch[1] || '';
    const matchStart = scriptMatch.index;
    const matchEnd = matchStart + fullMatch.length;

    // Find where the opening tag ends
    const openTagRegex = new RegExp(
      scriptContentPatterns.scriptTagOpen.source,
      'gi'
    );
    openTagRegex.lastIndex = matchStart;
    const openTagMatch = openTagRegex.exec(code);
    const openTagEnd = openTagMatch
      ? (openTagMatch.index ?? 0) + openTagMatch[0].length
      : matchStart;

    // Find where the closing tag starts
    const closeTagStart = matchEnd - '</script>'.length;

    scriptAreas.push({
      start: matchStart,
      end: matchEnd,
      content,
      openTagEnd,
      closeTagStart,
    });

    // Prevent infinite loops
    if (scriptContentRegex.lastIndex === scriptMatch.index) {
      scriptContentRegex.lastIndex++;
    }
  }

  // Step 2: Process HTML patterns in priority order
  for (const pattern of htmlPatterns) {
    const regex = new RegExp(pattern.regex.source, pattern.regex.flags);
    let match: RegExpExecArray | null;

    while ((match = regex.exec(code)) !== null) {
      const start = match.index;
      const end = start + match[0].length;

      // Skip if this range overlaps with script content (except for script tags themselves)
      let inScriptContent = false;
      for (const scriptArea of scriptAreas) {
        // Allow script tags themselves to be processed, but not content inside them
        if (start >= scriptArea.openTagEnd && end <= scriptArea.closeTagStart) {
          inScriptContent = true;
          break;
        }
      }

      if (inScriptContent) {
        continue;
      }

      // Skip if this range was already processed
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

  // Step 3: Process JavaScript content inside script tags
  for (const scriptArea of scriptAreas) {
    if (scriptArea.content.trim()) {
      // Tokenize the JavaScript content
      const jsTokens = tokenizeJavaScript(scriptArea.content);

      // Adjust token positions to be relative to the full HTML document
      const adjustedTokens = jsTokens.map((token) => ({
        ...token,
        start: token.start + scriptArea.openTagEnd,
        end: token.end + scriptArea.openTagEnd,
      }));

      // Add the JavaScript tokens
      for (const token of adjustedTokens) {
        let overlap = false;
        for (let i = token.start; i < token.end; i++) {
          if (processed.has(i)) {
            overlap = true;
            break;
          }
        }

        if (!overlap) {
          tokens.push(token);
          // Mark this range as processed
          for (let i = token.start; i < token.end; i++) {
            processed.add(i);
          }
        }
      }
    }
  }

  // Sort tokens by start position for proper rendering order
  return tokens.sort((a, b) => a.start - b.start);
}

/**
 * Tokenize JavaScript code using JavaScript patterns
 * @param code - JavaScript source code to tokenize
 * @returns Array of tokens with position information
 */
function tokenizeJavaScript(code: string): Token[] {
  const patterns = getCompiledPatterns();
  const languagePatterns = patterns.js;
  const tokens: Token[] = [];
  const processed = new Set<number>();

  // Process each pattern using cached regex objects
  for (const pattern of languagePatterns) {
    const regex = getCachedRegex('js', pattern.name);
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
 * Tokenize code using language-specific patterns with optimized caching
 * @param code - Source code to tokenize
 * @param language - Language to use for tokenization
 * @returns Array of tokens with position information
 */
function tokenize(code: string, language: Language): Token[] {
  // Use specialized HTML tokenizer for HTML content to handle script tags
  if (language === 'html') {
    return tokenizeHtml(code);
  }

  // Use JavaScript tokenizer for JavaScript content
  return tokenizeJavaScript(code);
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
    if (options?.language && 
        options.language !== 'js' && 
        options.language !== 'html') {
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
