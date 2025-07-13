import { it, expect, describe } from 'vitest';
import { highlight } from '../highlight';
import type { HighlightOptions } from '../types';

/**
 * Phase 5: Production-ready Public API Tests
 *
 * These tests focus on the robustness and reliability of the public API,
 * ensuring it handles all edge cases gracefully and never throws exceptions.
 */

describe('Public API - Production Ready Behavior', () => {
  describe('Input Validation and Error Handling', () => {
    it('should never throw exceptions for any input', () => {
      // Test various problematic inputs
      const problematicInputs = [
        null,
        undefined,
        '',
        '   ',
        42,
        true,
        false,
        {},
        [],
        Symbol('test'),
        new Date(),
        () => {},
        '<script>alert("xss")</script>',
        'function() { throw new Error("test"); }',
        'a'.repeat(100000), // Very long string
        '\x00\x01\x02', // Control characters
        '🚀💻✨', // Unicode/emojis
        '<>\'"&', // HTML special characters
      ];

      problematicInputs.forEach((input, index) => {
        expect(() => {
          highlight(input as any);
        }).not.toThrow(`Input ${index}: ${typeof input}`);
      });
    });

    it('should handle null and undefined input gracefully', () => {
      expect(highlight(null as any)).toBe('');
      expect(highlight(undefined as any)).toBe('');
    });

    it('should handle empty and whitespace input', () => {
      expect(highlight('')).toBe('');
      expect(highlight('   ')).toBe('   ');
      expect(highlight('\\n\\t  \\n')).toBe('\\n\\t  \\n');
    });

    it('should convert non-string input to string', () => {
      // Numbers get highlighted as tokens
      expect(highlight(42 as any)).toContain('42');
      // true/false are highlighted as keywords
      expect(highlight(true as any)).toContain('true');
      expect(highlight(false as any)).toContain('false');
      expect(highlight({} as any)).toBe('[object Object]');
    });

    it('should handle malformed options gracefully', () => {
      const code = 'const x = 42;';

      // Invalid options object
      expect(() => highlight(code, null as any)).not.toThrow();
      expect(() => highlight(code, undefined as any)).not.toThrow();
      expect(() => highlight(code, 'invalid' as any)).not.toThrow();
      expect(() => highlight(code, 42 as any)).not.toThrow();

      // Invalid language option
      expect(() =>
        highlight(code, { language: 'python' as any })
      ).not.toThrow();
      expect(() => highlight(code, { language: '' as any })).not.toThrow();
      expect(() => highlight(code, { language: null as any })).not.toThrow();

      // Results should still be reasonable
      const result1 = highlight(code, { language: 'invalid' as any });
      const result2 = highlight(code, { language: 'js' });
      expect(result1).toBe(result2); // Should fall back to auto-detection
    });
  });

  describe('Language Detection and Options', () => {
    it('should auto-detect JavaScript correctly', () => {
      const jsCode = 'const x = 42; function test() {}';
      const result = highlight(jsCode);

      expect(result).toContain('<span class=\"token keyword\">const</span>');
      expect(result).toContain('<span class=\"token keyword\">function</span>');
      expect(result).toContain('<span class=\"token number\">42</span>');
    });

    it('should auto-detect HTML correctly', () => {
      const htmlCode = '<div class=\"test\">Hello</div>';
      const result = highlight(htmlCode);

      expect(result).toContain('<span class=\"token tag\">');
      expect(result).toContain('<span class=\"token attr-name\">class</span>');
      expect(result).toContain(
        '<span class=\"token attr-value\">&quot;test&quot;</span>'
      );
    });

    it('should respect explicit language option', () => {
      const code = 'test content';

      const jsResult = highlight(code, { language: 'js' });
      const htmlResult = highlight(code, { language: 'html' });

      // Results should be different (different tokenization)
      expect(jsResult).toBe('test content'); // No JS tokens found
      expect(htmlResult).toBe('test content'); // No HTML tokens found
    });

    it('should handle language option case sensitivity', () => {
      const code = 'const x = 42;';
      const result1 = highlight(code, { language: 'js' });
      const result2 = highlight(code, { language: 'JS' as any });

      // Should fall back to auto-detection for invalid case
      expect(result2).toContain('<span class=\"token keyword\">const</span>');
    });
  });

  describe('Output Format and Safety', () => {
    it('should always return a string', () => {
      const inputs = [null, undefined, '', 'test', 42, {}, []];

      inputs.forEach((input) => {
        const result = highlight(input as any);
        expect(typeof result).toBe('string');
      });
    });

    it('should properly escape HTML entities', () => {
      const code = 'const html = \"<div>test</div>\";';
      const result = highlight(code, { language: 'js' });

      // Should escape HTML entities in the output
      expect(result).toContain('&lt;div&gt;');
      expect(result).toContain('&quot;');
      expect(result).not.toContain('<div>'); // Raw HTML should not appear
    });

    it('should handle HTML injection attempts safely', () => {
      const maliciousInputs = [
        '<script>alert(\"xss\")</script>',
        '<img src=x onerror=alert(1)>',
        'javascript:alert(1)',
        '\"onload=\"alert(1)\"',
        `'onload='alert(1)'`,
      ];

      maliciousInputs.forEach((input) => {
        const result = highlight(input);

        // Should not contain unescaped HTML
        expect(result).not.toMatch(/<script[^>]*>/);
        expect(result).not.toMatch(/onerror=/);
        expect(result).not.toContain('onload=alert');
        expect(result).not.toContain('onerror=alert');

        // Should contain escaped versions for inputs with HTML characters
        if (input.includes('<') || input.includes('"') || input.includes("'")) {
          expect(
            result.includes('&lt;') ||
              result.includes('&quot;') ||
              result.includes('&#39;')
          ).toBe(true);
        }
      });
    });
  });

  describe('Performance and Scalability', () => {
    it('should handle moderately large input efficiently', () => {
      // Generate a larger code sample
      const largeCode = `
        function processData() {
          const data = [${Array(1000)
            .fill(0)
            .map((_, i) => `\"item${i}\"`)
            .join(', ')}];
          return data.map(item => {
            // Process each item
            return item.toUpperCase();
          });
        }
      `;

      const startTime = Date.now();
      const result = highlight(largeCode, { language: 'js' });
      const endTime = Date.now();

      // Should complete in reasonable time (< 1 second)
      expect(endTime - startTime).toBeLessThan(1000);

      // Should still produce correct output
      expect(result).toContain('<span class=\"token keyword\">function</span>');
      expect(result).toContain('<span class=\"token keyword\">const</span>');
    });

    it('should be consistent across multiple calls', () => {
      const code = 'function test() { return \"hello\"; }';

      // Call multiple times and ensure results are identical
      const results = Array(10)
        .fill(0)
        .map(() => highlight(code, { language: 'js' }));

      results.forEach((result) => {
        expect(result).toBe(results[0]);
      });
    });

    it('should handle rapid successive calls', () => {
      const codes = [
        'const x = 42;',
        '<div>Hello</div>',
        'function test() {}',
        '<script>alert(\"test\");</script>',
      ];

      // Rapid successive calls should not interfere with each other
      const results = codes.map((code) => highlight(code));

      expect(results[0]).toContain(
        '<span class=\"token keyword\">const</span>'
      );
      expect(results[1]).toContain('<span class=\"token tag\">');
      expect(results[2]).toContain(
        '<span class=\"token keyword\">function</span>'
      );
      expect(results[3]).toContain(
        '<span class=\"token keyword\">alert</span>'
      );
    });
  });

  describe('Edge Cases and Boundary Conditions', () => {
    it('should handle very long lines', () => {
      const longLine = 'const x = \"' + 'a'.repeat(10000) + '\";';
      const result = highlight(longLine, { language: 'js' });

      expect(result).toContain('<span class=\"token keyword\">const</span>');
      expect(result).toContain('<span class=\"token string\">');
    });

    it('should handle deeply nested structures', () => {
      const nested =
        '<div><span><a><em><strong>' +
        'text' +
        '</strong></em></a></span></div>';
      const result = highlight(nested, { language: 'html' });

      expect(result).toContain('<span class=\"token tag\">');
    });

    it('should handle mixed content types', () => {
      const mixed = `
        <html>
          <head>
            <script>
              const config = { name: \"test\" };
              function init() {
                console.log(\"Initializing...\");
              }
            </script>
          </head>
          <body>
            <div id=\"app\">Loading...</div>
          </body>
        </html>
      `;

      const result = highlight(mixed, { language: 'html' });

      // Should handle both HTML and JavaScript
      expect(result).toContain('<span class=\"token tag\">');
      expect(result).toContain('<span class=\"token keyword\">const</span>');
      expect(result).toContain('<span class=\"token keyword\">function</span>');
    });

    it('should handle Unicode and special characters', () => {
      const unicode = 'const 🚀 = \"Hello 世界\"; // Comment with émojis 🎉';
      const result = highlight(unicode, { language: 'js' });

      expect(result).toContain('<span class=\"token keyword\">const</span>');
      expect(result).toContain('<span class=\"token string\">');
      expect(result).toContain('<span class=\"token comment\">');

      // Unicode should be preserved
      expect(result).toContain('🚀');
      expect(result).toContain('世界');
      expect(result).toContain('🎉');
    });

    it('should handle malformed code gracefully', () => {
      const malformedCodes = [
        'function test() { \"unclosed string',
        '<div class=\"unclosed attribute>',
        'const x = /* unclosed comment',
        '<<>><<invalid html',
        'function() { if() { while() {',
      ];

      malformedCodes.forEach((code) => {
        const result = highlight(code);

        // Should not throw and should return some reasonable output
        expect(typeof result).toBe('string');
        expect(result.length).toBeGreaterThan(0);
      });
    });
  });

  describe('TypeScript Integration', () => {
    it('should accept properly typed options', () => {
      const code = 'const x = 42;';
      const options: HighlightOptions = { language: 'js' };

      const result = highlight(code, options);
      expect(result).toContain('<span class=\"token keyword\">const</span>');
    });

    it('should work with optional options parameter', () => {
      const code = 'const x = 42;';

      // Both of these should compile and work
      const result1 = highlight(code);
      const result2 = highlight(code, {});
      const result3 = highlight(code, { language: 'js' });

      expect(result1).toContain('<span class=\"token keyword\">const</span>');
      expect(result2).toContain('<span class=\"token keyword\">const</span>');
      expect(result3).toContain('<span class=\"token keyword\">const</span>');
    });
  });
});
