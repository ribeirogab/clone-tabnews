import { z } from 'zod';

export enum NodeEnvEnum {
  Development = 'development',
  Production = 'production',
}

export enum SchemaTypeEnum {
  Public = 'public',
  Server = 'server',
}

const PUBLIC_ENV_SCHEMA = z.object({
  NODE_ENV: z.nativeEnum(NodeEnvEnum).default(NodeEnvEnum.Production),
});

const SERVER_ENV_SCHEMA = z
  .object({
    POSTGRES_SSL: z
      .string()
      .default('true')
      .transform((value) => {
        if (!['true', 'false'].includes(value) && typeof value === 'string') {
          try {
            const parsed = JSON.parse(value);

            return {
              rejectUnauthorized: parsed.rejectUnauthorized,
              ca: parsed.ca,
            };
          } catch {
            throw new Error('Invalid JSON string for POSTGRES_SSL');
          }
        }

        return value === 'true';
      })
      .refine(
        (value) => {
          if (typeof value === 'object') {
            return (
              typeof value.rejectUnauthorized === 'boolean' &&
              typeof value.ca === 'string'
            );
          }

          return true;
        },
        {
          message:
            'POSTGRES_SSL must have valid rejectUnauthorized and ca properties when provided as an object',
        },
      ),
    POSTGRES_PASSWORD: z.string(),
    POSTGRES_HOST: z.string(),
    POSTGRES_USER: z.string(),
    POSTGRES_DB: z.string(),
    POSTGRES_PORT: z
      .string()
      .refine((value) => !isNaN(Number(value)), {
        message: 'Port must be a number',
      })
      .transform((value) => Number(value))
      .refine(
        (value) => Number.isInteger(value) && value >= 0 && value <= 65535,
        {
          message: 'Port must be an integer between 0 and 65535',
        },
      ),
  })
  .and(PUBLIC_ENV_SCHEMA);

export type PublicEnv = z.infer<typeof PUBLIC_ENV_SCHEMA>;

export type ServerEnv = z.infer<typeof SERVER_ENV_SCHEMA>;

const SCHEMAS = {
  [SchemaTypeEnum.Public]: PUBLIC_ENV_SCHEMA,
  [SchemaTypeEnum.Server]: SERVER_ENV_SCHEMA,
};

// Memory cache
let PUBLIC_ENV_VARIABLES: PublicEnv;
let SERVER_ENV_VARIABLES: ServerEnv;

export class Env {
  public static parse({
    type = SchemaTypeEnum.Public,
    processEnv = process.env,
  }: {
    processEnv?: NodeJS.ProcessEnv;
    type?: SchemaTypeEnum;
  }) {
    console.log(`\n ○ Parsing ${type} env variables...`);

    const parsedEnvs = SCHEMAS[type].parse(processEnv);
    const total = Object.keys(parsedEnvs).length;

    console.log(` ✓ Env (${type}) variables parsed! (${total}) variables)`);

    return parsedEnvs;
  }

  public static get public() {
    if (!PUBLIC_ENV_VARIABLES) {
      PUBLIC_ENV_VARIABLES = this.parse({
        type: SchemaTypeEnum.Public,
      });
    }

    return PUBLIC_ENV_VARIABLES;
  }

  public static get server() {
    if (!SERVER_ENV_VARIABLES) {
      SERVER_ENV_VARIABLES = this.parse({
        type: SchemaTypeEnum.Server,
      }) as z.infer<typeof SERVER_ENV_SCHEMA>;
    }

    return SERVER_ENV_VARIABLES;
  }
}
