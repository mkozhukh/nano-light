# Minimal Code Highlighting Library Specification

## Overview

A lightweight, standalone code highlighting library optimized for minimal size and good performance. Provides basic syntax highlighting for JavaScript and HTML with automatic language detection.

## Core Requirements

### Supported Languages

- **JavaScript**: Keywords, strings, numbers, comments, operators
- **HTML**: Tags, attribute names, attribute values, comments, embedded `<script>` tags

### Size & Performance

- **Target size**: Extremely small (aim for <3KB minified+gzipped)
- **Performance**: Optimized for 2-10 small code snippets per page
- **Dependencies**: Zero external dependencies
- **Environment**: Browser (Node.js compatibility is a plus but not required)

## API Design

### Main Function

```javascript
highlight(code, (options = {}));
```

**Parameters:**

- `code` (string): Source code to highlight
- `options` (object, optional):
  - `language` (string, optional): Force specific language ('js' | 'html'). If not provided, auto-detects.

**Returns:**

- String: HTML with highlighted syntax wrapped in `<span>` elements with classes

### Language Detection

Auto-detection logic:

- If code contains `<` followed by letter/`!` → HTML
- Otherwise → JavaScript
- Override with explicit `language` option

## Token Types & CSS Classes

### JavaScript Tokens

- `token keyword` - Keywords (function, var, let, const, if, else, for, while, return, etc.)
- `token string` - String literals (single/double quotes, template literals)
- `token number` - Numeric literals
- `token comment` - Single-line (//) and multi-line (/\* \*/) comments
- `token operator` - Operators (+, -, \*, /, =, ==, ===, etc.)

### HTML Tokens

- `token tag` - Tag names and angle brackets (`<div>`, `</div>`)
- `token attr-name` - Attribute names (`class`, `id`, `src`)
- `token attr-value` - Attribute values (quoted strings)
- `token comment` - HTML comments (`<!-- -->`)

### Special Handling

- **HTML with `<script>` tags**: JavaScript inside `<script>` blocks should be highlighted with JavaScript rules
- **Nested structures**: Basic nesting support for quotes within quotes, etc. ( we can simplify it, by ignoring anythin inside of quoted lines )

## Implementation Strategy

### Parsing Approach

- **Regex-based tokenization** for size efficiency
- **Single-pass parsing** for performance
- **Simplified state machine** for handling context switches (HTML → JS in script tags)

### Core Algorithm

1. **Language Detection**: Quick heuristic check
2. **Tokenization**: Apply language-specific regex patterns
3. **Wrapping**: Wrap tokens in `<span class="token {type}">` elements
4. **Escaping**: Proper HTML escaping for special characters

## CSS Themes

### Theme Structure

Two complete CSS themes provided as separate files:

- `highlight-light.css` - Light theme
- `highlight-dark.css` - Dark theme

### Theme Control

- **No JavaScript theme switching** - themes controlled purely via CSS inclusion

### Sample Theme Structure

```css
/* Base styles */
.highlight-code {
  font-family: 'Courier New', monospace;
  font-size: 14px;
  line-height: 1.4;
}

/* Token styles */
.token.keyword {
  color: #d73a49;
}
.token.string {
  color: #032f62;
}
.token.number {
  color: #005cc5;
}
.token.comment {
  color: #6a737d;
  font-style: italic;
}
.token.operator {
  color: #d73a49;
}
.token.tag {
  color: #22863a;
}
.token.attr-name {
  color: #6f42c1;
}
.token.attr-value {
  color: #032f62;
}
```

## Usage Examples

### Basic Usage

```javascript
// Auto-detect language
const highlighted = highlight(`function hello() { return "world"; }`);
// Output: <span class="token keyword">function</span> <span class="token">hello</span>() { <span class="token keyword">return</span> <span class="token string">"world"</span>; }

// Force language
const htmlCode = highlight(`<div class="container">Hello</div>`, {
  language: 'html',
});
```

### DOM Integration

```javascript
// Process existing elements
document.querySelectorAll('code').forEach((el) => {
  el.innerHTML = highlight(el.textContent);
  el.classList.add('highlight-code');
});

// Process before insertion
const codeElement = document.createElement('code');
codeElement.innerHTML = highlight(sourceCode);
codeElement.classList.add('highlight-code');
```

## File Structure

```
highlight-mini/
├── src/
│   ├── highlight.js          # Main library
│   ├── patterns/
│   │   ├── javascript.js     # JS regex patterns
│   │   └── html.js           # HTML regex patterns
│   └── utils.js              # Helper functions
├── themes/
│   ├── light.css            # Light theme
│   └── dark.css             # Dark theme
├── dist/
│   ├── highlight.min.js     # Minified library
│   └── highlight.min.js.map # Source map
└── package.json
```

## Error Handling

- **No exceptions**: Library should never throw errors

## Browser Compatibility

- **Modern browsers**: ES6+ features acceptable
- **No polyfills required**: Use only well-supported features
- **Minimal DOM dependencies**: Only basic string manipulation

## Performance Considerations

- **Lazy compilation**: Compile regex patterns only when needed
- **Caching**: Cache compiled patterns between calls
- **Minimal allocations**: Reuse objects where possible
- **Early termination**: Stop processing on obvious non-matches

## Quality Targets

- **90% accuracy rule**: Perfect highlighting not required, good-enough results for common cases
- **Common patterns priority**: Focus on most frequently used syntax elements
- **Edge case tolerance**: Acceptable to fail on complex nested structures or unusual syntax
- **size of code**: we preffer smaller size to perfomance/quality
