import { defineConfig } from 'vitest/config';

export default defineConfig({
  esbuild: { jsx: 'automatic' },
  test: {
    include: ['app/**/*.test.{js,jsx}'],
    environment: 'jsdom',
    setupFiles: ['./vitest.setup.js'],
    restoreMocks: true,
  },
});
