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

  // Template literals - proper expression support
  {
    name: 'template-literal',
    regex: /`(?:[^`\\$]|\\.|\$(?!\{)|\$\{[^}]*\})*`/g,
    type: 'string',
  },

  // String literals - separate patterns for better matching
  {
    name: 'double-string',
    regex: /"(?:[^"\\]|\\[\s\S])*"/g,
    type: 'string',
  },
  {
    name: 'single-string',
    regex: /'(?:[^'\\]|\\[\s\S])*'/g,
    type: 'string',
  },

  // Numbers - including BigInt support
  {
    name: 'number',
    regex:
      /\b(?:0[xX][\da-fA-F]+[nN]?|0[bB][01]+[nN]?|0[oO][0-7]+[nN]?|\d+[nN]|\d*\.?\d+(?:[eE][+-]?\d+)?)\b/g,
    type: 'number',
  },

  // Keywords - essential JavaScript keywords
  {
    name: 'keyword',
    regex:
      /\b(?:alert|arguments|async|await|break|case|catch|class|const|continue|debugger|default|delete|do|else|eval|export|extends|false|finally|for|function|if|import|in|instanceof|let|new|null|return|static|super|switch|this|throw|true|try|typeof|undefined|var|void|while|with|yield)\b/g,
    type: 'keyword',
  },

  // Operators - essential operators only
  {
    name: 'operator',
    regex:
      /[+\-*%=!<>&|^~?:]+|&&|\|\||\*\*|\.\.\.|\?\?|\+\+|--|=>|==|!=|===|!==|<=|>=|\+=|-=|\*=|\?\?=/g,
    type: 'operator',
  },

  // Division operator - temporarily removed to avoid conflicts with comments
  // TODO: Add back with proper handling to not interfere with // and /* patterns
];
