import * as path from 'path';

import * as dotenv from 'dotenv';
import * as dotenvExpand from 'dotenv-expand';

const env = dotenv.config({ path: '.env.local' });
dotenvExpand.expand(env);

export default {
  cli: { migrationsDir: './migrations' },
  connectTimeoutMS: 3000,
  database: process.env.DB_NAME,
  entities: [path.join(__dirname, '**', '*.entity.{ts,js}')],
  host: process.env.DB_HOST,
  migrations: ['./migrations/*.ts'],
  migrationsTableName: 'typeorm_migrations',
  password: process.env.DB_PASSWORD,
  port: parseInt(process.env.DB_PORT || '', 10),
  type: 'postgres',
  username: process.env.DB_USERNAME,
};
