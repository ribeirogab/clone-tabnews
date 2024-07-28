import { defineWorkspace } from 'vitest/config';

export default defineWorkspace([
  {
    test: {
      include: ['**/*.spec.ts'],
      name: 'unit',
      environment: 'node',
    },
  },
  {
    test: {
      include: ['**/*.test.ts'],
      name: 'integration',
      environment: 'node',
    },
  },
]);
