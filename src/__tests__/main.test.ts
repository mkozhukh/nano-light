import { it, expect, describe } from 'vitest';
import { highlight } from '../highlight';
import { detectLanguage, escapeHtml } from '../utils';

// Basic functionality tests
it('should highlight JavaScript keywords', () => {
  const code = 'function hello() { return "world"; }';
  const result = highlight(code, { language: 'js' });

  expect(result).toContain('<span class="token keyword">function</span>');
  expect(result).toContain('<span class="token keyword">return</span>');
  expect(result).toContain(
    '<span class="token string">&quot;world&quot;</span>'
  );
});

it('should highlight HTML tags', () => {
  const code = '<div class="container">Hello</div>';
  const result = highlight(code, { language: 'html' });

  expect(result).toContain('<span class="token tag">');
  expect(result).toContain('<span class="token attr-name">class</span>');
  expect(result).toContain(
    '<span class="token attr-value">&quot;container&quot;</span>'
  );
});

it('should auto-detect language', () => {
  const htmlCode = '<div>Hello</div>';
  const jsCode = 'const x = 42;';

  const htmlResult = highlight(htmlCode);
  const jsResult = highlight(jsCode);

  expect(htmlResult).toContain('<span class="token tag">');
  expect(jsResult).toContain('<span class="token keyword">const</span>');
});

it('should handle empty input gracefully', () => {
  expect(highlight('')).toBe('');
  expect(highlight('   ')).toBe('   ');
});

it('should escape HTML entities', () => {
  const code = 'const html = "<div>test</div>";';
  const result = highlight(code);

  expect(result).toContain('&lt;div&gt;');
  expect(result).not.toContain('<div>');
});

// Phase 2 Enhancement Tests

describe('Enhanced Language Detection', () => {
  it('should detect HTML with various opening tags', () => {
    expect(detectLanguage('<div>')).toBe('html');
    expect(detectLanguage('<span>')).toBe('html');
    expect(detectLanguage('<html>')).toBe('html');
    expect(detectLanguage('<IMG>')).toBe('html');
  });

  it('should detect HTML with closing tags', () => {
    expect(detectLanguage('</div>')).toBe('html');
    expect(detectLanguage('</html>')).toBe('html');
    expect(detectLanguage('Some text </span>')).toBe('html');
  });

  it('should detect HTML comments', () => {
    expect(detectLanguage('<!-- comment -->')).toBe('html');
    expect(detectLanguage('Some text <!-- comment -->')).toBe('html');
  });

  it('should detect DOCTYPE declarations', () => {
    expect(detectLanguage('<!DOCTYPE html>')).toBe('html');
    expect(detectLanguage('<!doctype html>')).toBe('html');
    expect(detectLanguage('<!DOCTYPE HTML PUBLIC>')).toBe('html');
  });

  it('should detect HTML with processing instructions', () => {
    expect(detectLanguage('<?xml version="1.0"?>')).toBe('html');
  });

  it('should default to JavaScript for non-HTML content', () => {
    expect(detectLanguage('const x = 42;')).toBe('js');
    expect(detectLanguage('function test() {}')).toBe('js');
    expect(detectLanguage('var a = "hello";')).toBe('js');
    expect(detectLanguage('2 < 3 && 4 > 1')).toBe('js'); // < not followed by letter/!/?
  });

  it('should handle empty or whitespace input', () => {
    expect(detectLanguage('')).toBe('js');
    expect(detectLanguage('   ')).toBe('js');
    expect(detectLanguage('\n\t  \n')).toBe('js');
  });
});

describe('Enhanced HTML Escaping', () => {
  it('should escape all required HTML characters', () => {
    expect(escapeHtml('<')).toBe('&lt;');
    expect(escapeHtml('>')).toBe('&gt;');
    expect(escapeHtml('&')).toBe('&amp;');
    expect(escapeHtml('"')).toBe('&quot;');
    expect(escapeHtml("'")).toBe('&#39;');
  });

  it('should escape complex HTML content', () => {
    const input = '<div class="test" id=\'main\'>&nbsp;</div>';
    const expected =
      '&lt;div class=&quot;test&quot; id=&#39;main&#39;&gt;&amp;nbsp;&lt;/div&gt;';
    expect(escapeHtml(input)).toBe(expected);
  });

  it('should handle null and undefined input', () => {
    expect(escapeHtml(null as any)).toBe('');
    expect(escapeHtml(undefined as any)).toBe('');
  });

  it('should handle non-string input by converting to string', () => {
    expect(escapeHtml(42 as any)).toBe('42');
    expect(escapeHtml(true as any)).toBe('true');
    expect(escapeHtml({} as any)).toBe('[object Object]');
  });

  it('should preserve character positions for token boundaries', () => {
    const input = 'const msg = "Hello <world>";';
    const escaped = escapeHtml(input);
    // The escaped version should be longer but maintain relative positions
    expect(escaped).toContain('&lt;world&gt;');
    expect(escaped.indexOf('const')).toBe(0); // Position preserved
  });
});

describe('Pattern Caching Performance', () => {
  it('should cache and reuse patterns across multiple calls', () => {
    const code = 'function test() { return "hello"; }';

    // First call should initialize cache
    const result1 = highlight(code, { language: 'js' });
    const result2 = highlight(code, { language: 'js' });
    const result3 = highlight(code, { language: 'js' });

    // All results should be identical
    expect(result1).toBe(result2);
    expect(result2).toBe(result3);

    // And should contain expected highlights
    expect(result1).toContain('<span class="token keyword">function</span>');
    expect(result1).toContain('<span class="token keyword">return</span>');
  });

  it('should handle both JavaScript and HTML caching', () => {
    const jsCode = 'const x = 42;';
    const htmlCode = '<div>test</div>';

    // Initialize both caches
    const jsResult1 = highlight(jsCode, { language: 'js' });
    const htmlResult1 = highlight(htmlCode, { language: 'html' });

    // Second calls should use cached patterns
    const jsResult2 = highlight(jsCode, { language: 'js' });
    const htmlResult2 = highlight(htmlCode, { language: 'html' });

    // Results should be consistent
    expect(jsResult1).toBe(jsResult2);
    expect(htmlResult1).toBe(htmlResult2);
  });
});

describe('Error Handling and Edge Cases', () => {
  it('should never throw exceptions', () => {
    expect(() => highlight(null as any)).not.toThrow();
    expect(() => highlight(undefined as any)).not.toThrow();
    expect(() => highlight(42 as any)).not.toThrow();
    expect(() => highlight({} as any)).not.toThrow();
  });

  it('should handle malformed input gracefully', () => {
    const malformed = 'function test() { "unclosed string';
    const result = highlight(malformed);
    expect(result).toContain('function');
    expect(result).toContain('test');
  });

  it('should handle very long input', () => {
    const longCode = 'const x = ' + '"a"'.repeat(1000) + ';';
    const result = highlight(longCode);
    expect(result).toContain('<span class="token keyword">const</span>');
  });
});
