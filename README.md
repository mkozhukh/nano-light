# hightlight-nano

A minimal, zero-dependency code syntax highlighting library that supports JavaScript and HTML with automatic language detection. Optimized for size at just 1.53KB gzipped.

## Features

- 🚀 **Ultra-small bundle**: 1.53KB gzipped (ESM), 1.79KB (UMD)
- 🔍 **Automatic language detection**: Smart detection for JavaScript and HTML
- 🎯 **Script tag context switching**: Highlights JavaScript inside HTML `<script>` tags
- 🛡️ **Robust error handling**: Never throws exceptions, gracefully handles malformed input
- 🎨 **CSS themes included**: Light and dark themes provided
- 📦 **Multiple formats**: ESM, CommonJS, and UMD builds
- 💪 **TypeScript support**: Full type definitions included
- ⚡ **Zero dependencies**: No external runtime dependencies

## Installation

```bash
npm install hightlight-nano
```

```bash
yarn add hightlight-nano
```

```bash
pnpm add hightlight-nano
```

## Quick Start

```javascript
import { highlight } from 'hightlight-nano';

// Auto-detect language
const jsCode = highlight('function test() { return "hello"; }');
const htmlCode = highlight('<div class="container">Hello World</div>');

// Force specific language
const forcedJs = highlight('const x = 42;', { language: 'js' });
const forcedHtml = highlight('<p>Text</p>', { language: 'html' });
```

## API Reference

### `highlight(code, options?)`

Highlights source code with syntax highlighting for JavaScript and HTML.

#### Parameters

- **`code`** (`string`): Source code to highlight
- **`options`** (`HighlightOptions`, optional): Configuration options
  - **`language`** (`'js' | 'html'`, optional): Force specific language detection. If not provided, language will be auto-detected.

#### Returns

- **`string`**: HTML string with syntax highlighting wrapped in `<span>` elements with CSS classes

#### Examples

```javascript
// Basic usage with auto-detection
const highlighted = highlight('const name = "world";');

// Force JavaScript highlighting
const jsHighlighted = highlight('const x = 42;', { language: 'js' });

// Force HTML highlighting
const htmlHighlighted = highlight('<div>Hello</div>', { language: 'html' });

// Complex HTML with JavaScript
const complexHtml = highlight(`
<html>
  <head>
    <script>
      function greet() {
        console.log("Hello World!");
      }
    </script>
  </head>
  <body>
    <div onclick="greet()">Click me</div>
  </body>
</html>
`);
```

## CSS Theme Usage

Include one of the provided CSS themes in your HTML:

### Light Theme

```html
<link rel="stylesheet" href="node_modules/hightlight-nano/themes/light.css" />
```

### Dark Theme

```html
<link rel="stylesheet" href="node_modules/hightlight-nano/themes/dark.css" />
```

### Custom Themes

Create your own theme by styling the token classes:

```css
.token.keyword {
  color: #0066cc;
  font-weight: bold;
}
.token.string {
  color: #009900;
}
.token.number {
  color: #ff6600;
}
.token.comment {
  color: #666666;
  font-style: italic;
}
.token.operator {
  color: #333333;
}
.token.tag {
  color: #cc0066;
  font-weight: bold;
}
.token.attr-name {
  color: #0066cc;
}
.token.attr-value {
  color: #009900;
}
```

## TypeScript Support

The library includes comprehensive TypeScript definitions:

```typescript
import {
  highlight,
  HighlightOptions,
  Language,
  Token,
  TokenType,
} from 'hightlight-nano';

const options: HighlightOptions = { language: 'js' };
const result: string = highlight('const x = 42;', options);
```

### Type Definitions

```typescript
type Language = 'js' | 'html';
type TokenType =
  | 'keyword'
  | 'string'
  | 'number'
  | 'comment'
  | 'operator'
  | 'tag'
  | 'attr-name'
  | 'attr-value';

interface Token {
  type: TokenType;
  value: string;
  start: number;
  end: number;
}

interface HighlightOptions {
  language?: Language;
}
```

## Supported Languages

### JavaScript

- Keywords: `function`, `const`, `let`, `var`, `if`, `else`, `for`, `while`, etc.
- Strings: Single quotes, double quotes, template literals with expression support
- Numbers: Integers, floats, hex, binary, octal, BigInt
- Comments: Single-line (`//`) and multi-line (`/* */`)
- Operators: Arithmetic, logical, comparison, assignment, etc.

### HTML

- Tags: Opening, closing, and self-closing tags
- Attributes: Attribute names and values (quoted and unquoted)
- Comments: HTML comments (`<!-- -->`)
- Script tag context switching: JavaScript inside `<script>` tags

## Browser Compatibility

Works in all modern browsers that support:

- ES2015+ features
- Regular expressions with Unicode support

**Minimum browser versions:**

- Chrome 51+
- Firefox 54+
- Safari 10+
- Edge 79+

For older browsers, use a transpilation tool like Babel.

## Bundle Formats

The library is available in multiple formats:

- **ESM** (`dist/index.js`): 3.20KB minified, 1.53KB gzipped
- **CommonJS** (`dist/index.cjs`): 3.56KB minified, 1.73KB gzipped
- **UMD** (`dist/index.umd.js`): 3.67KB minified, 1.79KB gzipped

## Performance

The library is optimized for performance:

- Regex patterns are cached and reused
- Single-pass tokenization algorithm
- Minimal DOM manipulation
- Efficient memory usage

## Error Handling

The library is designed to never throw exceptions:

```javascript
// All of these are safe and will not throw
highlight(null); // Returns ''
highlight(undefined); // Returns ''
highlight(''); // Returns ''
highlight(123); // Converts to string and highlights
highlight(malformedCode); // Returns escaped original code
```

## License

MIT License - see LICENSE file for details.

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make your changes
4. Run tests: `yarn test:run`
5. Submit a pull request

## Development

```bash
# Install dependencies
yarn install

# Run tests
yarn test:run

# Build the library
yarn build

# Development with watch mode
yarn dev
```
