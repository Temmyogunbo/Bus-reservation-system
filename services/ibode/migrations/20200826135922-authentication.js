'use strict';
const path = require('path');

module.exports = {
  up: async (queryInterface, Sequelize, _, sequelize) => {
    console.log(`Running migration ${path.basename(__filename)}`);

    await sequelize.query(`
    CREATE TABLE IF NOT EXISTS "authentications" (
      "id" SERIAl,
      "firstName" VARCHAR(255) NOT NULL,
      "lastName" VARCHAR(255) NOT NULL,
      "userName" VARCHAR(255) NOT NULL UNIQUE,
      "password" VARCHAR(255) NOT NULL,
      "email" VARCHAR(255) NOT NULL,
      "active" BOOLEAN NOT NULL,
      "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      "deletedAt" TIMESTAMP WITH TIME ZONE,
      PRIMARY KEY("id")
    );
    
    CREATE INDEX IF NOT EXISTS authentications_first_name ON public.authentications USING btree ("firstName");
    CREATE INDEX IF NOT EXISTS authentications_last_name ON public.authentications USING btree ("lastName");
    CREATE INDEX IF NOT EXISTS authentications_user_name ON public.authentications USING btree ("userName");
    `)
  },

  down: async (queryInterface, Sequelize, _, sequelize) => {
    console.log(`Running migration ${path.basename(__filename)}`);

    await sequelize.query(`
    DROP TABLE IF EXISTS "authentications" CASCADE;
    DROP INDEX IF EXISTS "authentications_first_name";
    DROP INDEX IF EXISTS "authentications_last_name";
    DROP INDEX IF EXISTS "authentications_user_name";
    DROP INDEX IF EXISTS "authentications_created_at";
    DROP INDEX IF EXISTS "authentications_deleted_at";
    DROP INDEX IF EXISTS "authentications_updated_at";
    `)

  }
};
