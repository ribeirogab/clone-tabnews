import { exec } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

import { config } from 'dotenv';

const NODE_PG_MIGRATE_PATH = path.join(
  path.resolve(),
  'node_modules',
  'node-pg-migrate',
  'bin',
  'node-pg-migrate.js',
);
const MIGRATIONS_DIRECTORY = path.join(
  path.resolve(),
  'infra',
  'database',
  'migrations',
);

const BASE_COMMAND = `${NODE_PG_MIGRATE_PATH} -m '${MIGRATIONS_DIRECTORY}'`;

const loadEnv = () => {
  if (process.env.NODE_ENV !== 'production') {
    config({ path: '.env.development' });
  }

  const {
    POSTGRES_HOST,
    POSTGRES_PORT,
    POSTGRES_USER,
    POSTGRES_DB,
    POSTGRES_PASSWORD,
  } = process.env;

  const DATABASE_URL = `postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@${POSTGRES_HOST}:${POSTGRES_PORT}/${POSTGRES_DB}`;

  fs.writeFileSync('.env.migrations', `DATABASE_URL=${DATABASE_URL}\n`);
};

const renameFiles = () => {
  const files = fs.readdirSync(MIGRATIONS_DIRECTORY);

  files.forEach((file) => {
    if (path.extname(file) !== '.js') {
      return;
    }

    const oldPath = path.join(MIGRATIONS_DIRECTORY, file);
    const newPath = path.join(
      MIGRATIONS_DIRECTORY,
      path.basename(file, '.js') + '.cjs',
    );

    try {
      fs.renameSync(oldPath, newPath);
    } catch (err) {
      console.error('Error renaming file:', err);
    }
  });
};

const create = () => {
  const migrationName = process.argv[3];

  exec(`${BASE_COMMAND} create ${migrationName}`, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error: ${error.message}`);
      process.exit(1);
    }

    if (stderr) {
      console.error(`Error: ${stderr}`);
      process.exit(1);
    }

    console.log(stdout?.replace('.js', '.cjs'));
    renameFiles();
  });
};

const up = () => {
  loadEnv();

  exec(
    `${BASE_COMMAND}  --envPath .env.migrations up `,
    (error, stdout, stderr) => {
      if (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
      }

      if (stderr) {
        console.error(`Error: ${stderr}`);
        process.exit(1);
      }

      console.log(stdout);
    },
  );
};

const down = () => {
  loadEnv();

  exec(
    `${BASE_COMMAND}  --envPath .env.migrations down `,
    (error, stdout, stderr) => {
      if (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
      }

      if (stderr) {
        console.error(`Error: ${stderr}`);
        process.exit(1);
      }

      console.log(stdout);
    },
  );
};

const COMMANDS = {
  create,
  down,
  up,
};

const command = process.argv[2];

if (!command) {
  console.error('Please provide a command');
  process.exit(1);
}

if (!COMMANDS[command]) {
  console.error(
    `Invalid command, please use one of the following: ${Object.keys(COMMANDS).join(', ')}`,
  );

  process.exit(1);
}

COMMANDS[command]();
