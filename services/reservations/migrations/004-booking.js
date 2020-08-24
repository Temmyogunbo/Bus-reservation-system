'use strict';
const path = require('path')

module.exports = {
  up: async (queryInterface, Sequelize, _, sequelize) => {
   console.log(`Running migration ${path.basename(__filename)}`);

   await sequelize.query(`
   CREATE TABLE IF NOT EXISTS "bookings" (
     "id" SERIAL,
     "departFrom" VARCHAR(255) NOT NULL,
     "departTo" VARCHAR(255) NOT NULL,
     "departureDate" TIMESTAMP WITH TIME ZONE NOT NULL,
     "seatNo" INTEGER NOT NULL,
     "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
     "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
     "deletedAt" TIMESTAMP WITH TIME ZONE,
     "vehicleId" INTEGER REFERENCES "vehicles" ("id") ON DELETE SET NULL ON UPDATE SET NULL,
     "userId" INTEGER REFERENCES "users" ("id") ON DELETE SET NULL ON UPDATE SET NULL,
     PRIMARY KEY("id")
   );

   CREATE INDEX IF NOT EXISTS bookings_departure_date ON public.bookings USING btree ("departureDate");
   CREATE INDEX IF NOT EXISTS bookings_depart_from ON public.bookings USING btree ("departFrom");
   CREATE INDEX IF NOT EXISTS bookings_depart_to ON public.bookings USING btree ("departTo");
   `)
  },

  down: async (queryInterface, Sequelize, _, sequelize) => {
    console.log(`Running migration ${path.basename(__filename)}`)
    await sequelize.query(`
    DROP TABLE IF EXISTS "bookings" CASCADE;
    DROP INDEX IF EXISTS "bookings_departure_date";
    DROP INDEX IF EXISTS "bookings_depart_from";
    DROP INDEX IF EXISTS "bookings_depart_to";
    DROP INDEX IF EXISTS "bookings_deleted_at";
    DROP INDEX IF EXISTS "bookings_updated_at";
    DROP INDEX IF EXISTS "bookings_created_at";


    `)
  }
};
