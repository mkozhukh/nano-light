import { it, expect } from 'vitest';
import { highlight } from '../highlight';

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
