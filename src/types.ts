/**
 * Supported languages for syntax highlighting
 */
export type Language = 'js' | 'html';

/**
 * Token types for syntax highlighting
 */
export type TokenType =
  | 'keyword'
  | 'string'
  | 'number'
  | 'comment'
  | 'operator'
  | 'tag'
  | 'attr-name'
  | 'attr-value';

/**
 * A syntax token with position information
 */
export interface Token {
  /** The type of token */
  type: TokenType;
  /** The actual text content of the token */
  value: string;
  /** Start position in the source code */
  start: number;
  /** End position in the source code */
  end: number;
}

/**
 * Options for the highlight function
 */
export interface HighlightOptions {
  /**
   * Force specific language detection instead of auto-detection
   * If not provided, language will be auto-detected
   */
  language?: Language;
}

/**
 * Language pattern definition for tokenization
 */
export interface LanguagePattern {
  /** Pattern name for debugging */
  name: string;
  /** Regular expression for matching */
  regex: RegExp;
  /** Token type to assign to matches */
  type: TokenType;
}

/**
 * Compiled language patterns with caching
 */
export interface CompiledPatterns {
  /** JavaScript patterns */
  js: LanguagePattern[];
  /** HTML patterns */
  html: LanguagePattern[];
}
