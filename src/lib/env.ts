import { z } from 'zod';

export enum NodeEnvEnum {
  Development = 'development',
  Production = 'production',
}

const ENV_SCHEMA = z.object({
  NODE_ENV: z.nativeEnum(NodeEnvEnum).default(NodeEnvEnum.Production),
});

export const env = ENV_SCHEMA.parse(process.env);
