import * as api from './api'

import { afterSync, sequelize } from './config/sequelize'

const init = () => {
  api.init()
  sequelize.sync({ force: false }).then(afterSync)
}

let isCleaningUp = false
const cleanup = async ({
  code = 0,
  message,
  err,
}: {
  code?: number
  message?: string
  err?: Error | null | {}
}) => {
  if (isCleaningUp) return
  else isCleaningUp = true

  if (err) console.error(err)
  else if (message) console.log(message)

  console.log('Cleaning up before exit')
  api.stop()
  await sequelize.close()

  process.exit(code)
}

process
  .on('exit', () => cleanup({ message: 'Process exited' }))
  .on('SIGINT', () => cleanup({ message: 'Process received SIGINT' }))
  .on('uncaughtException', (err) => cleanup({ code: 1, err }))
  .on('unhandledRejection', (err) => cleanup({ code: 1, err }))

init()
