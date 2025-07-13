import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    open: false,
    ui: {
      port: 3000,
    },
  },
});
