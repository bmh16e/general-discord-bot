import { TsMorphMetadataProvider } from '@mikro-orm/reflection';
import { Options } from '@mikro-orm/core';
import { Server, Channel, Prompt } from '../entities/index.ts';
import { defineConfig } from '@mikro-orm/postgresql';

export default defineConfig({
  tsNode: true,
  entities: [Server, Channel, Prompt], // path to our JS entities (dist), relative to `baseDir`
  entitiesTs: ['src/db/entities/*.ts'], // path to our TS entities (src), relative to `baseDir`
  metadataProvider: TsMorphMetadataProvider,
  dbName: 'railway',
  // type: 'postgresql',
  host: process.env.DB_HOST,
  port: 54867,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  // debug: true,
});
