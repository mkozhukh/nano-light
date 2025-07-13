import type { LanguagePattern } from '../types';

/**
 * JavaScript language patterns for tokenization
 * Ordered by priority - more specific patterns should come first
 */
export const javascriptPatterns: LanguagePattern[] = [
  // Single-line comments
  {
    name: 'single-line-comment',
    regex: /\/\/.*$/gm,
    type: 'comment',
  },

  // Multi-line comments
  {
    name: 'multi-line-comment',
    regex: /\/\*[\s\S]*?\*\//g,
    type: 'comment',
  },

  // Template literals - enhanced to handle escape sequences and expressions
  {
    name: 'template-literal',
    regex: /`(?:[^`\\$]|\\.|\\[\r\n]|\$(?!\{)|(?:\$\{(?:[^{}\\]|\\.)*\}))*`/g,
    type: 'string',
  },

  // Double-quoted strings - enhanced escape sequence handling
  {
    name: 'double-quoted-string',
    regex: /"(?:[^"\\]|\\.|\\[\r\n])*"/g,
    type: 'string',
  },

  // Single-quoted strings - enhanced escape sequence handling
  {
    name: 'single-quoted-string',
    regex: /'(?:[^'\\]|\\.|\\[\r\n])*'/g,
    type: 'string',
  },

  // Numbers - comprehensive support for all JavaScript numeric literals
  {
    name: 'number',
    regex:
      /\b(?:0[xX][0-9a-fA-F]+[nN]?|0[bB][01]+[nN]?|0[oO][0-7]+[nN]?|\d+[nN]|(?:\d+\.?\d*|\.\d+)(?:[eE][+-]?\d+)?[nN]?)\b/g,
    type: 'number',
  },

  // Keywords - comprehensive set including ES6+ features and built-ins
  {
    name: 'keyword',
    regex:
      /\b(?:abstract|arguments|async|await|boolean|break|byte|case|catch|char|class|const|continue|debugger|default|delete|do|double|else|enum|eval|export|extends|false|final|finally|float|for|function|goto|if|implements|import|in|instanceof|int|interface|let|long|native|new|null|package|private|protected|public|return|short|static|super|switch|synchronized|this|throw|throws|transient|true|try|typeof|undefined|var|void|volatile|while|with|yield)\b/g,
    type: 'keyword',
  },

  // Operators - comprehensive set including assignment, comparison, and logical operators (excluding /)
  {
    name: 'operator',
    regex:
      /[+\-*%=!<>&|^~?:@]+|&&|\|\||<<|>>|>>>|\*\*|\.\.\.|\?\?|\?\?\=|\|\|\=|&&\=|\+\+|--|=>|==|!=|===|!==|<=|>=|\+=|-=|\*=|%=|\*\*=|<<=|>>=|>>>=|&=|\|=|\^=/g,
    type: 'operator',
  },

  // Division operator - temporarily removed to avoid conflicts with comments
  // TODO: Add back with proper handling to not interfere with // and /* patterns
];
