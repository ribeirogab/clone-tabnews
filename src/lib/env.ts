import { z } from 'zod';

export enum NodeEnvEnum {
  Development = 'development',
  Production = 'production',
}

const ENV_SCHEMA = z.object({
  NODE_ENV: z.nativeEnum(NodeEnvEnum).default(NodeEnvEnum.Production),
});
let ENV_VARIABLES: z.infer<typeof ENV_SCHEMA>;

export const parseEnv = (processEnv?: NodeJS.ProcessEnv) => {
  console.log('\n ○ Parsing env variables...');

  const parsedEnvs = ENV_SCHEMA.parse(processEnv || process.env);

  console.log(` ✓ Env variables parsed! (${parseEnv.length} variables)`);

  return parsedEnvs;
};

export const env = () => {
  if (!ENV_VARIABLES) {
    ENV_VARIABLES = parseEnv(process.env);
  }

  return ENV_VARIABLES;
};
