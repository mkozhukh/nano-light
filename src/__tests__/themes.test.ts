/**
 * Theme validation tests for Phase 6 CSS requirements
 * 
 * These tests validate that both light and dark themes:
 * 1. Follow exact Phase 6 color specifications
 * 2. Include all required token type styles
 * 3. Meet base style requirements (font, size, line-height)
 * 4. Maintain proper CSS structure
 */

import { readFileSync } from 'fs';
import { join } from 'path';

const THEMES_DIR = join(__dirname, '../../themes');

/**
 * Parse CSS file and extract style rules
 */
function parseCssRules(cssContent: string): Record<string, Record<string, string>> {
  const rules: Record<string, Record<string, string>> = {};
  
  // Remove CSS comments first
  let cleanedContent = cssContent.replace(/\/\*[\s\S]*?\*\//g, '');
  
  // Extract CSS rules (selector { properties })
  const ruleMatches = cleanedContent.match(/([^{]+)\s*\{([^}]+)\}/g);
  
  if (ruleMatches) {
    for (const rule of ruleMatches) {
      const [, selectorPart, propertiesPart] = rule.match(/([^{]+)\s*\{([^}]+)\}/) || [];
      
      if (selectorPart && propertiesPart) {
        const selector = selectorPart.trim();
        
        // Skip if selector starts with /* (partial comment) or is empty
        if (!selector || selector.startsWith('/*') || selector.startsWith('*')) {
          continue;
        }
        
        const properties: Record<string, string> = {};
        
        // Parse properties - split on semicolon, then on colon
        const propertyPairs = propertiesPart.split(';').filter(p => p.trim());
        
        for (const pair of propertyPairs) {
          const colonIndex = pair.indexOf(':');
          if (colonIndex > 0) {
            const key = pair.substring(0, colonIndex).trim();
            const value = pair.substring(colonIndex + 1).trim();
            
            // Remove CSS comments from value
            const cleanValue = value.replace(/\/\*.*?\*\//g, '').trim();
            
            if (key && cleanValue) {
              properties[key] = cleanValue;
            }
          }
        }
        
        if (Object.keys(properties).length > 0) {
          rules[selector] = properties;
        }
      }
    }
  }
  
  return rules;
}

// Phase 6 color specifications
const PHASE_6_LIGHT_COLORS = {
  keywords: '#d73a49',
  strings: '#032f62', 
  numbers: '#005cc5',
  comments: '#6a737d',
  operators: '#d73a49',
  tags: '#22863a',
  attrNames: '#6f42c1',
  attrValues: '#032f62'
};

const REQUIRED_TOKEN_TYPES = [
  'keyword',
  'string', 
  'number',
  'comment',
  'operator',
  'tag',
  'attr-name',
  'attr-value'
];

describe('Theme CSS Validation', () => {
  let lightCssContent: string;
  let darkCssContent: string;
  let lightRules: Record<string, Record<string, string>>;
  let darkRules: Record<string, Record<string, string>>;

  beforeAll(() => {
    // Read theme files
    lightCssContent = readFileSync(join(THEMES_DIR, 'light.css'), 'utf-8');
    darkCssContent = readFileSync(join(THEMES_DIR, 'dark.css'), 'utf-8');
    
    // Parse CSS rules
    lightRules = parseCssRules(lightCssContent);
    darkRules = parseCssRules(darkCssContent);
  });

  describe('Light Theme Validation', () => {
    it('should have correct base styles following Phase 6 specification', () => {
      const baseRule = lightRules['.highlight-code'];
      
      expect(baseRule).toBeDefined();
      expect(baseRule['font-family']).toBe("'Courier New', monospace");
      expect(baseRule['font-size']).toBe('14px');
      expect(baseRule['line-height']).toBe('1.4');
    });

    it('should include all required token type styles', () => {
      for (const tokenType of REQUIRED_TOKEN_TYPES) {
        const selector = `.token.${tokenType}`;
        expect(lightRules[selector]).toBeDefined();
        expect(lightRules[selector]['color']).toBeDefined();
      }
    });

    it('should follow Phase 6 color specifications exactly', () => {
      // Keywords
      expect(lightRules['.token.keyword']['color']).toBe(PHASE_6_LIGHT_COLORS.keywords);
      
      // Strings  
      expect(lightRules['.token.string']['color']).toBe(PHASE_6_LIGHT_COLORS.strings);
      
      // Numbers
      expect(lightRules['.token.number']['color']).toBe(PHASE_6_LIGHT_COLORS.numbers);
      
      // Comments
      expect(lightRules['.token.comment']['color']).toBe(PHASE_6_LIGHT_COLORS.comments);
      expect(lightRules['.token.comment']['font-style']).toBe('italic');
      
      // Operators
      expect(lightRules['.token.operator']['color']).toBe(PHASE_6_LIGHT_COLORS.operators);
      
      // Tags
      expect(lightRules['.token.tag']['color']).toBe(PHASE_6_LIGHT_COLORS.tags);
      
      // Attribute names
      expect(lightRules['.token.attr-name']['color']).toBe(PHASE_6_LIGHT_COLORS.attrNames);
      
      // Attribute values
      expect(lightRules['.token.attr-value']['color']).toBe(PHASE_6_LIGHT_COLORS.attrValues);
    });

    it('should have consistent operator and keyword colors', () => {
      const keywordColor = lightRules['.token.keyword']['color'];
      const operatorColor = lightRules['.token.operator']['color'];
      
      expect(operatorColor).toBe(keywordColor);
    });

    it('should have consistent string and attribute value colors', () => {
      const stringColor = lightRules['.token.string']['color'];
      const attrValueColor = lightRules['.token.attr-value']['color'];
      
      expect(attrValueColor).toBe(stringColor);
    });
  });

  describe('Dark Theme Validation', () => {
    it('should have correct base styles following Phase 6 specification', () => {
      const baseRule = darkRules['.highlight-code'];
      
      expect(baseRule).toBeDefined();
      expect(baseRule['font-family']).toBe("'Courier New', monospace");
      expect(baseRule['font-size']).toBe('14px');
      expect(baseRule['line-height']).toBe('1.4');
    });

    it('should include all required token type styles', () => {
      for (const tokenType of REQUIRED_TOKEN_TYPES) {
        const selector = `.token.${tokenType}`;
        expect(darkRules[selector]).toBeDefined();
        expect(darkRules[selector]['color']).toBeDefined();
      }
    });

    it('should have different colors from light theme for contrast', () => {
      // Dark theme should use different colors than light theme
      const darkKeyword = darkRules['.token.keyword']['color'];
      const lightKeyword = lightRules['.token.keyword']['color'];
      
      expect(darkKeyword).not.toBe(lightKeyword);
      
      const darkString = darkRules['.token.string']['color'];
      const lightString = lightRules['.token.string']['color'];
      
      expect(darkString).not.toBe(lightString);
    });

    it('should maintain italic styling for comments', () => {
      expect(darkRules['.token.comment']['font-style']).toBe('italic');
    });

    it('should have consistent operator and keyword colors in dark theme', () => {
      const keywordColor = darkRules['.token.keyword']['color'];
      const operatorColor = darkRules['.token.operator']['color'];
      
      expect(operatorColor).toBe(keywordColor);
    });

    it('should have consistent string and attribute value colors in dark theme', () => {
      const stringColor = darkRules['.token.string']['color'];
      const attrValueColor = darkRules['.token.attr-value']['color'];
      
      expect(attrValueColor).toBe(stringColor);
    });
  });

  describe('Theme Structure Validation', () => {
    it('should not include JavaScript-based theme switching', () => {
      // Themes should be pure CSS, no JavaScript code
      // We check for script tags or function declarations that would indicate JS
      expect(lightCssContent).not.toMatch(/<script\b|function\s*\(/i);
      expect(darkCssContent).not.toMatch(/<script\b|function\s*\(/i);
    });

    it('should include proper CSS comments and documentation', () => {
      expect(lightCssContent).toContain('/**');
      expect(lightCssContent).toContain('Phase 6');
      
      expect(darkCssContent).toContain('/**');
      expect(darkCssContent).toContain('Phase 6');
    });

    it('should have utility classes for different use cases', () => {
      // Both themes should provide inline and block variants
      expect(lightRules['.highlight-code.inline']).toBeDefined();
      expect(lightRules['.highlight-code.block']).toBeDefined();
      
      expect(darkRules['.highlight-code.inline']).toBeDefined();
      expect(darkRules['.highlight-code.block']).toBeDefined();
    });
  });

  describe('Color Contrast and Accessibility', () => {
    it('should use appropriate background colors', () => {
      const lightBg = lightRules['.highlight-code']['background-color'];
      const darkBg = darkRules['.highlight-code']['background-color'];
      
      expect(lightBg).toBeDefined();
      expect(darkBg).toBeDefined();
      expect(lightBg).not.toBe(darkBg);
    });

    it('should use appropriate text colors', () => {
      const lightText = lightRules['.highlight-code']['color'];
      const darkText = darkRules['.highlight-code']['color'];
      
      expect(lightText).toBeDefined();
      expect(darkText).toBeDefined();
      expect(lightText).not.toBe(darkText);
    });
  });
});