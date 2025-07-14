# nano-light

A minimal, zero-dependency code syntax highlighting library that supports JavaScript and HTML with automatic language detection. Optimized for size at just 1.53KB gzipped.

## Features

- 🚀 **Ultra-small bundle**: 1.53KB gzipped (ESM), 1.79KB (UMD)
- 🔍 **Automatic language detection**: Smart detection for JavaScript and HTML
- 🎯 **Script tag context switching**: Highlights JavaScript inside HTML `<script>` tags
- 🎨 **CSS themes included**: Light and dark themes provided
- ⚡ **Zero dependencies**: No external runtime dependencies

## Installation

```bash
npm install nano-light
```

```bash
yarn add nano-light
```

## Quick Start

```javascript
import { highlight } from 'nano-light';

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

````javascript
// Basic usage with auto-detection
const highlighted = highlight('const name = "world";');

// Force JavaScript highlighting
const jsHighlighted = highlight('const x = 42;', { language: 'js' });

// Force HTML highlighting
const htmlHighlighted = highlight('<div>Hello</div>', { language: 'html' });

## CSS Theme Usage

Include one of the provided CSS themes in your HTML:

### Light Theme

```html
<link rel="stylesheet" href="node_modules/nanolight/themes/light.css" />
````

### Dark Theme

```html
<link rel="stylesheet" href="node_modules/nanolight/themes/dark.css" />
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
} from 'nanolight';

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

Works in all modern browsers

## Bundle Formats

The library is available in multiple formats:

- **ESM** (`dist/index.js`): 2.70KB minified, 1.35KB gzipped
- **CommonJS** (`dist/index.cjs`): 3.06KB minified, 1.48KB gzipped (estimated)
- **UMD** (`dist/index.umd.js`): 3.16KB minified, 1.60KB gzipped

## Error Handling

The library is designed to never throw exceptions:

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
