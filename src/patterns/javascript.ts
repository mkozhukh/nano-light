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

  // Template literals (backtick strings)
  {
    name: 'template-literal',
    regex: /`(?:[^`\\]|\\.)*`/g,
    type: 'string',
  },

  // Double-quoted strings
  {
    name: 'double-quoted-string',
    regex: /"(?:[^"\\]|\\.)*"/g,
    type: 'string',
  },

  // Single-quoted strings
  {
    name: 'single-quoted-string',
    regex: /'(?:[^'\\]|\\.)*'/g,
    type: 'string',
  },

  // Numbers (integers, floats, hex, binary, octal)
  {
    name: 'number',
    regex:
      /\b(?:0[xX][0-9a-fA-F]+|0[bB][01]+|0[oO][0-7]+|\d+\.?\d*(?:[eE][+-]?\d+)?)\b/g,
    type: 'number',
  },

  // Keywords
  {
    name: 'keyword',
    regex:
      /\b(?:async|await|break|case|catch|class|const|continue|debugger|default|delete|do|else|enum|export|extends|false|finally|for|function|if|import|in|instanceof|let|new|null|return|super|switch|this|throw|true|try|typeof|undefined|var|void|while|with|yield)\b/g,
    type: 'keyword',
  },

  // Operators
  {
    name: 'operator',
    regex: /[+\-*/%=!<>&|^~?:]+|&&|\|\||<<|>>|>>>|\*\*|\.\.\.|\?\?/g,
    type: 'operator',
  },
];
