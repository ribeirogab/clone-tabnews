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
    POSTGRES_PASSWORD: z.string(),
  })
  .and(PUBLIC_ENV_SCHEMA);

export type PublicEnv = z.infer<typeof PUBLIC_ENV_SCHEMA>;

export type ServerEnv = z.infer<typeof SERVER_ENV_SCHEMA>;

const SCHEMAS = {
  [SchemaTypeEnum.Public]: PUBLIC_ENV_SCHEMA,
  [SchemaTypeEnum.Server]: SERVER_ENV_SCHEMA,
};

let PUBLIC_ENV_VARIABLES: PublicEnv;
let SERVER_ENV_VARIABLES: ServerEnv;

export const parseEnv = ({
  type = SchemaTypeEnum.Public,
  processEnv = process.env,
}: {
  processEnv?: NodeJS.ProcessEnv;
  type?: SchemaTypeEnum;
}) => {
  console.log(`\n ○ Parsing ${type} env variables...`);

  const parsedEnvs = SCHEMAS[type].parse(processEnv);

  console.log(
    ` ✓ Env (${type}) variables parsed! (${parseEnv.length} variables)`,
  );

  return parsedEnvs;
};

export const getPublicEnvs = (): PublicEnv => {
  if (!PUBLIC_ENV_VARIABLES) {
    PUBLIC_ENV_VARIABLES = parseEnv({
      type: SchemaTypeEnum.Public,
    });
  }

  return PUBLIC_ENV_VARIABLES;
};

export const getServerEnvs = (): ServerEnv => {
  if (!SERVER_ENV_VARIABLES) {
    SERVER_ENV_VARIABLES = parseEnv({
      type: SchemaTypeEnum.Server,
    }) as z.infer<typeof SERVER_ENV_SCHEMA>;
  }

  return SERVER_ENV_VARIABLES;
};
