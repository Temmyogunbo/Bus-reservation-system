import { last, split } from 'lodash/fp'
import * as pg from 'pg'
import Sequelize from 'sequelize'

import {
  DATABASE_URL,
  NODE_ENV,
  POSTGRES_IDLE_IN_TRANSACTION_SESSION_TIMEOUT_MS,
  POSTGRES_LOCK_TIMEOUT_MS,
  POSTGRES_POOL_ACQUIRE,
  POSTGRES_POOL_ENABLED,
  POSTGRES_POOL_IDLE,
  POSTGRES_POOL_MAX,
  POSTGRES_SSL,
  POSTGRES_STATEMENT_TIMEOUT_MS,
  SEQUELIZE_LOGGING,
  TEST_DATABASE_URL,
} from './env'

// Sequelize BIGINT type is saved on the DB as a String instead of a Number if this option is not set to true.
// For reference see the workaround link: https://github.com/sequelize/sequelize/issues/2383#issuecomment-58006083
pg.defaults.parseInt8 = true

const isTestEnv = NODE_ENV === 'test'

const dbUrl = isTestEnv ? TEST_DATABASE_URL : DATABASE_URL

if (isTestEnv) {
  console.log(`Using TEST_DATABASE_URL for NODE_ENV === 'test'`)
} else {
  console.log(`Using DATABASE_URL (${last(split('/', DATABASE_URL))}) for NODE_ENV === ${NODE_ENV}`)
}

const { Op } = Sequelize
const operatorsAliases = {
  $eq: Op.eq,
  $ne: Op.ne,
  $gte: Op.gte,
  $gt: Op.gt,
  $lte: Op.lte,
  $lt: Op.lt,
  $not: Op.not,
  $in: Op.in,
  $notIn: Op.notIn,
  $is: Op.is,
  $like: Op.like,
  $notLike: Op.notLike,
  $iLike: Op.iLike,
  $notILike: Op.notILike,
  $regexp: Op.regexp,
  $notRegexp: Op.notRegexp,
  $iRegexp: Op.iRegexp,
  $notIRegexp: Op.notIRegexp,
  $between: Op.between,
  $notBetween: Op.notBetween,
  $overlap: Op.overlap,
  $contains: Op.contains,
  $contained: Op.contained,
  $adjacent: Op.adjacent,
  $strictLeft: Op.strictLeft,
  $strictRight: Op.strictRight,
  $noExtendRight: Op.noExtendRight,
  $noExtendLeft: Op.noExtendLeft,
  $and: Op.and,
  $or: Op.or,
  $any: Op.any,
  $all: Op.all,
  $values: Op.values,
  $col: Op.col,
}

const getLogging = () => {
  if (!SEQUELIZE_LOGGING) return false
  if (isTestEnv) return console.log // eslint-disable-line no-console
  return console.log
}

const options: Sequelize.Options = {
  dialect: 'postgres',
  dialectOptions: {
    ssl: POSTGRES_SSL,
  },
  logging: getLogging(),
  operatorsAliases,
}

if (POSTGRES_POOL_ENABLED) {
  options.pool = {
    acquire: POSTGRES_POOL_ACQUIRE,
    idle: POSTGRES_POOL_IDLE,
    max: POSTGRES_POOL_MAX,
    min: 0,
  }
}

const sequelize: Sequelize.Sequelize = new Sequelize.Sequelize(dbUrl, options)

sequelize.beforeDefine((attributes, modelOptions: any) => {
  // attributes.uid = {
  //   type: Sequelize.UUID,
  //   defaultValue: Sequelize.literal('uuid_generate_v4()'),
  // }

  if (modelOptions.timestamps) {
    attributes.createdAt = {
      type: Sequelize.DATE,
      defaultValue: Sequelize.literal('NOW()'),
    }
    attributes.updatedAt = {
      type: Sequelize.DATE,
      defaultValue: Sequelize.literal('NOW()'),
    }
  }
})

const afterSync = async () => {
  await sequelize.query(`
    SET lock_timeout TO '${POSTGRES_LOCK_TIMEOUT_MS}ms';
    SET idle_in_transaction_session_timeout TO '${POSTGRES_IDLE_IN_TRANSACTION_SESSION_TIMEOUT_MS}ms';
    SET statement_timeout TO '${POSTGRES_STATEMENT_TIMEOUT_MS}ms';
  `)
  console.log(`db.sync done`)
}

export { sequelize, Sequelize, afterSync }
