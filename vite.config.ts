import { defineConfig } from 'vitest/config';

export default defineConfig({
  base: '/PlayPiano/',
  test: {
    include: ['src/**/*.test.ts'],
    passWithNoTests: true,
  },
});
