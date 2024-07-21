import { describe, it, expect, beforeEach } from 'vitest';

import { NodeEnvEnum } from './env';

const makeSut = async () => {
  const { env, parseEnv } = await import('./env');

  return {
    parseEnv,
    env,
  };
};

describe('env configuration', () => {
  const ORIGINAL_ENV = process.env;

  beforeEach(() => {
    process.env = { ...ORIGINAL_ENV };
  });

  describe('parseEnv', () => {
    it('should default NODE_ENV to production', async () => {
      Object.assign(process.env, { NODE_ENV: undefined });
      const { parseEnv } = await makeSut();

      const parsedEnv = parseEnv(process.env);

      expect(parsedEnv.NODE_ENV).toBe(NodeEnvEnum.Production);
    });

    it('should parse NODE_ENV as development', async () => {
      Object.assign(process.env, { NODE_ENV: 'development' });
      const { parseEnv } = await makeSut();

      const parsedEnv = parseEnv(process.env);

      expect(parsedEnv.NODE_ENV).toBe(NodeEnvEnum.Development);
    });

    it('should parse NODE_ENV as production', async () => {
      Object.assign(process.env, { NODE_ENV: 'production' });
      const { parseEnv } = await makeSut();

      const parsedEnv = parseEnv(process.env);

      expect(parsedEnv.NODE_ENV).toBe(NodeEnvEnum.Production);
    });

    it('should throw an error for invalid NODE_ENV', async () => {
      Object.assign(process.env, { NODE_ENV: 'invalid_env' });
      const { parseEnv } = await makeSut();

      expect(() => {
        parseEnv(process.env);
      }).toThrow();
    });
  });

  describe('env', () => {
    it('should return cached environment variables', async () => {
      Object.assign(process.env, { NODE_ENV: 'development' });
      const { env } = await makeSut();

      const firstCall = env();
      const secondCall = env();

      expect(firstCall).toBe(secondCall);
    });
  });
});
