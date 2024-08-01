import { NodeEnvEnum, SchemaTypeEnum, Env, ServerEnv } from './env';

describe('env configuration', () => {
  const ORIGINAL_ENV = process.env;

  beforeEach(() => {
    process.env = { ...ORIGINAL_ENV };
  });

  describe('Env.parse', () => {
    it('should default NODE_ENV to production', () => {
      Object.assign(process.env, { NODE_ENV: undefined });

      const parsedEnv = Env.parse({
        type: SchemaTypeEnum.Public,
        processEnv: process.env,
      });

      expect(parsedEnv.NODE_ENV).toBe(NodeEnvEnum.Production);
    });

    it('should parse NODE_ENV as development', () => {
      Object.assign(process.env, { NODE_ENV: 'development' });

      const parsedEnv = Env.parse({
        processEnv: process.env,
        type: SchemaTypeEnum.Public,
      });

      expect(parsedEnv.NODE_ENV).toBe(NodeEnvEnum.Development);
    });

    it('should parse NODE_ENV as production', () => {
      Object.assign(process.env, { NODE_ENV: 'production' });

      const parsedEnv = Env.parse({
        processEnv: process.env,
        type: SchemaTypeEnum.Public,
      });

      expect(parsedEnv.NODE_ENV).toBe(NodeEnvEnum.Production);
    });

    it('should throw an error for invalid NODE_ENV', () => {
      Object.assign(process.env, { NODE_ENV: 'invalid_env' });

      expect(() => {
        Env.parse({ processEnv: process.env, type: SchemaTypeEnum.Public });
      }).toThrow();
    });

    it('should parse server env variables', () => {
      Object.assign(process.env, {
        POSTGRES_PASSWORD: 'password',
        POSTGRES_HOST: 'localhost',
        POSTGRES_USER: 'user',
        POSTGRES_DB: 'db',
        POSTGRES_PORT: '5432',
        NODE_ENV: 'production',
      });

      const parsedEnv = Env.parse({
        type: SchemaTypeEnum.Server,
        processEnv: process.env,
      }) as ServerEnv;

      expect(parsedEnv.POSTGRES_PASSWORD).toBe('password');
      expect(parsedEnv.POSTGRES_HOST).toBe('localhost');
      expect(parsedEnv.POSTGRES_USER).toBe('user');
      expect(parsedEnv.POSTGRES_DB).toBe('db');
      expect(parsedEnv.POSTGRES_PORT).toBe(5432);
    });

    it('should throw an error if POSTGRES_PASSWORD is missing for server env', () => {
      Object.assign(process.env, {
        POSTGRES_PASSWORD: undefined,
        POSTGRES_HOST: 'localhost',
        POSTGRES_USER: 'user',
        POSTGRES_DB: 'db',
        POSTGRES_PORT: '5432',
        NODE_ENV: 'production',
      });

      expect(() => {
        Env.parse({ processEnv: process.env, type: SchemaTypeEnum.Server });
      }).toThrow();
    });
  });

  describe('Env.public', () => {
    it('should return parsed public environment variables', () => {
      Object.assign(process.env, { NODE_ENV: 'development' });

      expect(Env.public.NODE_ENV).toBe(NodeEnvEnum.Development);
    });

    it('should cache parsed public environment variables', () => {
      Object.assign(process.env, { NODE_ENV: 'development' });
      const firstCall = Env.public;
      const secondCall = Env.public;

      expect(firstCall).toBe(secondCall);
    });
  });

  describe('Env.server', () => {
    it('should return parsed server environment variables', () => {
      Object.assign(process.env, {
        POSTGRES_PASSWORD: 'password',
        POSTGRES_HOST: 'localhost',
        POSTGRES_USER: 'user',
        POSTGRES_DB: 'db',
        POSTGRES_PORT: '5432',
        NODE_ENV: 'production',
      });

      expect(Env.server.NODE_ENV).toBe(NodeEnvEnum.Production);
      expect(Env.server.POSTGRES_PASSWORD).toBe('password');
      expect(Env.server.POSTGRES_HOST).toBe('localhost');
      expect(Env.server.POSTGRES_USER).toBe('user');
      expect(Env.server.POSTGRES_DB).toBe('db');
      expect(Env.server.POSTGRES_PORT).toBe(5432);
    });

    it('should cache parsed server environment variables', () => {
      Object.assign(process.env, {
        POSTGRES_PASSWORD: 'password',
        POSTGRES_HOST: 'localhost',
        POSTGRES_USER: 'user',
        POSTGRES_DB: 'db',
        POSTGRES_PORT: '5432',
        NODE_ENV: 'production',
      });

      const firstCall = Env.server;
      const secondCall = Env.server;

      expect(firstCall).toBe(secondCall);
    });
  });
});
