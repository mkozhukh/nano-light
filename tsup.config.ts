import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['cjs', 'esm', 'iife'],
  dts: true,
  clean: true,
  splitting: false,
  sourcemap: true,
  minify: true,
  globalName: 'HighlightNano',
  outExtension({ format }) {
    return {
      js: format === 'iife' ? '.umd.js' : format === 'cjs' ? '.cjs' : '.js',
    };
  },
  esbuildOptions(options) {
    options.target = 'es2020';
    options.treeShaking = true;
    options.minifyWhitespace = true;
    options.minifyIdentifiers = true;
    options.minifySyntax = true;
  },
});
