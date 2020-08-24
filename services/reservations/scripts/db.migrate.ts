import '../src/models'

import { get, isEmpty, map } from 'lodash/fp'
import Umzug from 'umzug'
import path from 'path';
import { sequelize } from '../src/config/sequelize'

const [, , ...migrations] = process.argv
const throwError = () => {
  throw new Error(
    'Migration tried to use old style "done" callback. Please upgrade to "umzug" and return a promise instead.'
  )
}
const umzug = new Umzug({
  storage: 'sequelize',
  storageOptions: { sequelize },
  migrations: {
    params: [sequelize.getQueryInterface(), sequelize.constructor, throwError, sequelize],
    path: path.join(__dirname, '../migrations'),
    pattern: /\.js$/,
  },
})

const init = async () => {
  if (isEmpty(migrations)) {
    const pending = await umzug.pending().catch((err: Error) => console.error(err))

    if (isEmpty(pending)) {
      console.info('No migrations pending')
      return
    }
    // @ts-ignore
    const pendingMigrations = map(get('file'))(pending)
    console.info(`Running all pending migrations: ${pendingMigrations.join(', ')}`)
    await umzug.up()
  } else {
    console.info(`Migrating: ${migrations.join(', ')}`)
    await umzug.up(migrations)
  }
}

init().then(async () => {
  await sequelize.close()
  process.exit(0)
})
