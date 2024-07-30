import { describe, it, expect, beforeEach } from 'vitest';

import {
  NodeEnvEnum,
  SchemaTypeEnum,
  parseEnv,
  getPublicEnvs,
  getServerEnvs,
  ServerEnv,
} from './env';

describe('env configuration', () => {
  const ORIGINAL_ENV = process.env;

  beforeEach(() => {
    process.env = { ...ORIGINAL_ENV };
  });

  describe('parseEnv', () => {
    it('should default NODE_ENV to production', () => {
      Object.assign(process.env, { NODE_ENV: undefined });

      const parsedEnv = parseEnv({
        type: SchemaTypeEnum.Public,
        processEnv: process.env,
      });

      expect(parsedEnv.NODE_ENV).toBe(NodeEnvEnum.Production);
    });

    it('should parse NODE_ENV as development', () => {
      Object.assign(process.env, { NODE_ENV: 'development' });

      const parsedEnv = parseEnv({
        processEnv: process.env,
        type: SchemaTypeEnum.Public,
      });

      expect(parsedEnv.NODE_ENV).toBe(NodeEnvEnum.Development);
    });

    it('should parse NODE_ENV as production', () => {
      Object.assign(process.env, { NODE_ENV: 'production' });

      const parsedEnv = parseEnv({
        processEnv: process.env,
        type: SchemaTypeEnum.Public,
      });

      expect(parsedEnv.NODE_ENV).toBe(NodeEnvEnum.Production);
    });

    it('should throw an error for invalid NODE_ENV', () => {
      Object.assign(process.env, { NODE_ENV: 'invalid_env' });

      expect(() => {
        parseEnv({ processEnv: process.env, type: SchemaTypeEnum.Public });
      }).toThrow();
    });

    it('should parse server env variables', () => {
      Object.assign(process.env, {
        POSTGRES_PASSWORD: 'password',
        NODE_ENV: 'production',
      });

      const parsedEnv = parseEnv({
        type: SchemaTypeEnum.Server,
        processEnv: process.env,
      }) as ServerEnv;

      expect(parsedEnv.POSTGRES_PASSWORD).toBe('password');
    });

    it('should throw an error if POSTGRES_PASSWORD is missing for server env', () => {
      Object.assign(process.env, {
        POSTGRES_PASSWORD: undefined,
        NODE_ENV: 'production',
      });

      expect(() => {
        parseEnv({ processEnv: process.env, type: SchemaTypeEnum.Server });
      }).toThrow();
    });
  });

  describe('getPublicEnvs', () => {
    it('should return parsed public environment variables', () => {
      Object.assign(process.env, { NODE_ENV: 'development' });
      const publicEnvs = getPublicEnvs();

      expect(publicEnvs.NODE_ENV).toBe(NodeEnvEnum.Development);
    });

    it('should cache parsed public environment variables', () => {
      Object.assign(process.env, { NODE_ENV: 'development' });
      const firstCall = getPublicEnvs();
      const secondCall = getPublicEnvs();

      expect(firstCall).toBe(secondCall);
    });
  });

  describe('getServerEnvs', () => {
    it('should return parsed server environment variables', () => {
      Object.assign(process.env, {
        POSTGRES_PASSWORD: 'password',
        NODE_ENV: 'production',
      });

      const serverEnvs = getServerEnvs();

      expect(serverEnvs.NODE_ENV).toBe(NodeEnvEnum.Production);
      expect(serverEnvs.POSTGRES_PASSWORD).toBe('password');
    });

    it('should cache parsed server environment variables', () => {
      Object.assign(process.env, {
        POSTGRES_PASSWORD: 'password',
        NODE_ENV: 'production',
      });

      const firstCall = getServerEnvs();
      const secondCall = getServerEnvs();

      expect(firstCall).toBe(secondCall);
    });
  });
});
