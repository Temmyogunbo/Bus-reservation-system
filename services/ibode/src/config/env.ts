import * as env from 'env-var'
require('dotenv').config()

const PORT = env.get('PORT').required().asInt()
const NODE_ENV = env.get('NODE_ENV').required().asString()
const SECRET_KEY = env.get('SECRET_KEY').required().asString()

// Database
const DATABASE_URL = env
  .get('DATABASE_URL')
  .required()
  .asString()
const TEST_DATABASE_URL = env
  .get('TEST_DATABASE_URL')
  .required()
  .asString()
const POSTGRES_POOL_MAX = env.get('POSTGRES_POOL_MAX').asInt()
const POSTGRES_POOL_ACQUIRE = env.get('POSTGRES_POOL_ACQUIRE').asInt()
const POSTGRES_POOL_ENABLED = env.get('POSTGRES_POOL_ENABLED').asBool()
const POSTGRES_POOL_IDLE = env.get('POSTGRES_POOL_IDLE').asInt()
const POSTGRES_SSL = env.get('POSTGRES_SSL').asBool()

// Postgres timeout options
 const POSTGRES_LOCK_TIMEOUT_MS = env.get('POSTGRES_LOCK_TIMEOUT_MS').asInt()
 const POSTGRES_IDLE_IN_TRANSACTION_SESSION_TIMEOUT_MS = env
  .get('POSTGRES_IDLE_IN_TRANSACTION_SESSION_TIMEOUT_MS')
  .asInt()
 const POSTGRES_STATEMENT_TIMEOUT_MS = env
  .get('POSTGRES_STATEMENT_TIMEOUT_MS')
  .asInt()
const SEQUELIZE_LOGGING = env.get('SEQUELIZE_LOGGING').asBool()

export { SECRET_KEY, PORT, NODE_ENV, POSTGRES_IDLE_IN_TRANSACTION_SESSION_TIMEOUT_MS, POSTGRES_LOCK_TIMEOUT_MS, POSTGRES_STATEMENT_TIMEOUT_MS , TEST_DATABASE_URL, DATABASE_URL, POSTGRES_POOL_ACQUIRE, POSTGRES_POOL_MAX, POSTGRES_POOL_ENABLED, POSTGRES_POOL_IDLE, POSTGRES_SSL, SEQUELIZE_LOGGING}