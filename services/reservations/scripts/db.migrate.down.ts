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
  await sequelize.authenticate()

  if (isEmpty(migrations)) {
    console.error('Please specify which migrations to migrate down')
  } else {
    console.info(`Migrating: ${migrations.join(', ')}`)
    await umzug.down(migrations)
  }
}

init().then(async () => {
  await sequelize.close()
  process.exit(0)
})
