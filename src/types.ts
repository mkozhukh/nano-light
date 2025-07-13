/**
 * Supported languages for syntax highlighting.
 * 
 * @public
 */
export type Language = 'js' | 'html';

/**
 * Token types for syntax highlighting. These correspond to CSS classes
 * that will be applied to highlighted tokens.
 * 
 * @public
 */
export type TokenType =
  | 'keyword'    // JavaScript keywords and built-in functions
  | 'string'     // String literals (quoted strings, template literals)
  | 'number'     // Numeric literals (integers, floats, hex, binary, etc.)
  | 'comment'    // Comments (single-line //, multi-line /* */, HTML <!-- -->)
  | 'operator'   // Operators (+, -, *, /, =, ==, etc.)
  | 'tag'        // HTML tags (<div>, </span>, etc.)
  | 'attr-name'  // HTML attribute names (class, id, src, etc.)
  | 'attr-value'; // HTML attribute values (quoted strings)

/**
 * A syntax token with position information.
 * 
 * Represents a highlighted segment of code with its type and position.
 * The position information allows for precise token placement during rendering.
 * 
 * @public
 */
export interface Token {
  /** The type of token, determines the CSS class applied */
  type: TokenType;
  /** The actual text content of the token (already escaped) */
  value: string;
  /** Start position in the source code (inclusive) */
  start: number;
  /** End position in the source code (exclusive) */
  end: number;
}

/**
 * Options for the highlight function.
 * All options are optional and provide sensible defaults.
 * 
 * @public
 */
export interface HighlightOptions {
  /**
   * Force specific language detection instead of auto-detection.
   * 
   * - 'js': Treat input as JavaScript code
   * - 'html': Treat input as HTML code  
   * - undefined: Auto-detect language based on content
   * 
   * Invalid values will be ignored and fall back to auto-detection.
   * 
   * @default undefined (auto-detect)
   */
  language?: Language;
}

/**
 * Language pattern definition for tokenization.
 * 
 * Defines how to recognize and classify different syntax elements
 * within source code using regular expressions.
 * 
 * @internal
 */
export interface LanguagePattern {
  /** Pattern name for debugging and identification */
  name: string;
  /** Regular expression for matching syntax elements */
  regex: RegExp;
  /** Token type to assign to matches from this pattern */
  type: TokenType;
}

/**
 * Compiled language patterns with caching support.
 * 
 * Contains all patterns for different languages, organized for
 * efficient lookup and caching of compiled regular expressions.
 * 
 * @internal
 */
export interface CompiledPatterns {
  /** JavaScript language patterns */
  js: LanguagePattern[];
  /** HTML language patterns */
  html: LanguagePattern[];
}
