import { configDefaults, defineConfig } from 'vitest/config';

const EXCLUDE_PATHS: string[] = [];

export default defineConfig({
  test: {
    exclude: [...configDefaults.exclude, ...EXCLUDE_PATHS],
    coverage: {
      reportsDirectory: './test-output/coverage',
      reporter: ['cobertura', 'lcov'],
      provider: 'v8',
      exclude: [...EXCLUDE_PATHS],
    },
    env: {},
  },
});
