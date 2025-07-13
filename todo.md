# Highlight-Nano Implementation Plan

## Phase 1: Project Setup

**Goal**: Initialize the project foundation with TypeScript, build tools, and testing framework

### Requirements:

- Initialize TypeScript project with strict type checking
- Configure Vite for building the library (ESM and UMD formats)
- Set up Vitest for unit testing
- Create initial folder structure:
  ```
  src/
    highlight.ts
    patterns/
      javascript.ts
      html.ts
    utils.ts
    types.ts
  themes/
    light.css
    dark.css
  __tests__/
  dist/
  ```
- Configure build to produce minified output <3KB
- Add package.json with zero dependencies

## Phase 2: Core Architecture

**Goal**: Design the foundational types and base highlighter infrastructure

### Requirements:

- Define TypeScript interfaces for:
  - Token type (type, value, start, end)
  - Highlighter options
  - Language patterns
- Implement language detection function:
  - Check for HTML indicators (`<` followed by letter/`!`)
  - Default to JavaScript
  - Allow manual override via options
- Create HTML escaping utility:
  - Escape `<`, `>`, `&`, `"`, `'`
  - Preserve token boundaries
- Design pattern caching mechanism for performance

## Phase 3: JavaScript Language Support

**Goal**: Implement complete JavaScript syntax highlighting

### Requirements:

- Define regex patterns for:
  - Keywords: function, var, let, const, if, else, for, while, return, etc.
  - String literals: single quotes, double quotes, template literals
  - Numbers: integers, floats, hex, binary, octal
  - Comments: single-line (//) and multi-line (/\* \*/)
  - Operators: arithmetic, comparison, logical, assignment
- Implement tokenizer that:
  - Processes code in single pass
  - Handles nested structures (quotes in quotes)
  - Returns array of tokens with positions
- Wrap tokens in appropriate span elements with CSS classes

## Phase 4: HTML Language Support

**Goal**: Implement HTML highlighting with script tag support

### Requirements:

- Define regex patterns for:
  - Tags: opening, closing, self-closing
  - Attribute names
  - Attribute values (quoted strings)
  - HTML comments (<!-- -->)
- Implement special handling for <script> tags:
  - Detect script tag boundaries
  - Switch to JavaScript tokenizer for content
  - Return to HTML mode after </script>
- Handle edge cases:
  - Unclosed tags
  - Missing quotes
  - Nested quotes in attributes

## Phase 5: Public API

**Goal**: Create the main highlight function with proper error handling

### Requirements:

- Implement `highlight(code, options)` function:
  - Accept code string and optional options object
  - Support language option ('js' | 'html' | auto)
  - Return highlighted HTML string
- Error handling:
  - Never throw exceptions
  - Return original code on failure
  - Gracefully handle malformed input
- Export as ES module and UMD

## Phase 6: CSS Themes

**Goal**: Create light and dark themes with consistent styling

### Requirements:

- Base styles (.highlight-code):
  - Monospace font (Courier New fallback)
  - 14px font size
  - 1.4 line height
- Token colors for light theme:
  - Keywords: #d73a49
  - Strings: #032f62
  - Numbers: #005cc5
  - Comments: #6a737d (italic)
  - Operators: #d73a49
  - Tags: #22863a
  - Attribute names: #6f42c1
  - Attribute values: #032f62
- Dark theme with appropriate contrast
- No JavaScript-based theme switching

## Phase 7: Testing

**Goal**: Comprehensive test coverage for all features

### Requirements:

- Language detection tests:
  - HTML detection with various tags
  - JavaScript as default
  - Manual language override
- JavaScript tokenization tests:
  - All token types
  - Complex expressions
  - Edge cases (unclosed strings, etc.)
- HTML tokenization tests:
  - Various tag structures
  - Script tag integration
  - Malformed HTML handling
- API tests:
  - Options handling
  - Error scenarios
  - Output format validation

## Phase 8: Optimization

**Goal**: Meet size and performance targets

### Requirements:

- Bundle size optimization:
  - Target <3KB minified + gzipped
  - Remove unnecessary code
  - Optimize regex patterns
- Performance optimization:
  - Lazy pattern compilation
  - Pattern caching between calls
  - Minimal object allocations
  - Early termination for non-matches
- Measure and document performance metrics

## Phase 9: Documentation

**Goal**: Complete documentation for users and contributors

### Requirements:

- README.md with:
  - Installation instructions
  - Basic usage examples
  - API reference
  - Theme usage
  - Browser compatibility
- Update spec.md with:
  - Implementation decisions
  - Deviations from original spec
  - Performance characteristics
- JSDoc comments for all public APIs
- Example HTML page demonstrating usage
