'use strict';
const path = require('path');

module.exports = {
  up: async (queryInterface, Sequelize, _, sequelize) => {
    console.log(`Running migration ${path.basename(__filename)}`);

    await sequelize.query(`
    CREATE TABLE IF NOT EXISTS "vehicles" (
      "id" SERIAL,
      "name" VARCHAR(255) NOT NULL,
      "model" VARCHAR(255) NOT NULL,
      "color" VARCHAR(255) NOT NUll,
      "numberOfSeats" INTEGER NOT NULL,
      "yearOfManufacture" INTEGER NOT NULL,
      "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      "deletedAt" TIMESTAMP WITH TIME ZONE,
      PRIMARY KEY("id")
    );

    CREATE INDEX IF NOT EXISTS vehicles_name ON public.vehicles USING btree ("name");
    CREATE INDEX IF NOT EXISTS vehicles_model ON public.vehicles USING btree ("model");

    `)
  },

  down: async (queryInterface, Sequelize, _,sequelize) => {
    console.log(`Running migration ${path.basename(__filename)}`);

    await sequelize.query(`
    DROP TABLE IF EXISTS "vehicles" CASCADE;
    DROP INDEX IF EXISTS "vehicles_name";
    DROP INDEX IF EXISTS "vehicles_name";
    DROP INDEX IF EXISTS "vehicles_created_at";
    DROP INDEX IF EXISTS "vehicles_deleted_at";
    DROP INDEX IF EXISTS "vehicles_updated_at";
    `)

  }
};
