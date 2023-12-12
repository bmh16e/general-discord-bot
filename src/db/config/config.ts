import { Knex } from 'knex';
export const pgConfig: Knex = require('knex')({
  client: 'pg',
  connection: {
    host: process.env.DB_HOST,
    port: 54867,
    user: process.env.DB_USER,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
  },
});

export const dbInit = async () => {
  try {
    if (!(await pgConfig.schema.hasTable('servers'))) {
      await pgConfig.schema.createTable('servers', (table: any) => {
        table.string('server_id').primary();
        table.string('name');
      });
    }

    if (!(await pgConfig.schema.hasTable('channels'))) {
      await pgConfig.schema.createTable('channels', (table: any) => {
        table.string('channel_id').primary();
        table.string('name');
        table
          .string('server_id')
          .notNullable()
          .references('server_id')
          .inTable('servers')
          .onDelete('CASCADE');
      });
    }

    if (!(await pgConfig.schema.hasTable('prompts'))) {
      await pgConfig.schema.createTable('prompts', (table: any) => {
        table.increments('prompt_id').primary();
        table.string('prompt_content', 2500);
        table.boolean('use_user_context').defaultTo(false);
        table
          .string('channel_id')
          .unique()
          .notNullable()
          .references('channel_id')
          .inTable('channels')
          .onDelete('CASCADE');
      });
    }
  } catch (err) {
    console.log('Error in dbInit: ', err);
  }
};
