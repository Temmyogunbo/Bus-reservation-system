'use strict';
const path = require('path');

module.exports = {
  up: async (queryInterface, Sequelize, _, sequelize) => {
    console.log(`Running migration ${path.basename(__filename)}`);

    await sequelize.query(`
    CREATE TABLE IF NOT EXISTS "users" (
      "id" SERIAl,
      "firstName" VARCHAR(255) NOT NULL,
      "lastName" VARCHAR(255) NOT NULL,
      "email" VARCHAR(255) NOT NULL UNIQUE,
      "userName" VARCHAR(255) NOT NULL UNIQUE,
      "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      "deletedAt" TIMESTAMP WITH TIME ZONE,
      PRIMARY KEY("id")
    );

    CREATE INDEX IF NOT EXISTS users_first_name ON public.users USING btree ("firstName");
    CREATE INDEX IF NOT EXISTS users_last_name ON public.users USING btree ("lastName");
    CREATE INDEX IF NOT EXISTS users_user_name ON public.users USING btree ("userName");
    CREATE INDEX IF NOT EXISTS users_email ON public.users USING btree ("email");

    `)
  },

  down: async (queryInterface, Sequelize, _, sequelize) => {
    console.log(`Running migration ${path.basename(__filename)}`);

    await sequelize.query(`
    DROP TABLE IF EXISTS "users" CASCADE;
    DROP INDEX IF EXISTS "users_first_name";
    DROP INDEX IF EXISTS "users_last_name";
    DROP INDEX IF EXISTS "users_user_name";
    DROP INDEX IF EXISTS "users_email";
    DROP INDEX IF EXISTS "users_created_at";
    DROP INDEX IF EXISTS "users_deleted_at";
    DROP INDEX IF EXISTS "users_updated_at";

    `)

  }
};
