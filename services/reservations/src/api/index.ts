import * as http from 'http'

import { PORT } from '../config/env'
import { app } from './app'
let server: http.Server

const init = () => {
  server = app.listen(PORT, (err: Error) => {
    if (err) console.error(err)
    else console.log(`Server is listening on ${PORT}`)
  })
}

const stop = () => {
  if (server.close) {
    server.close(() => {
      console.log('Server closed.')
    })
  } else {
    console.warn('Server not started.')
  }
}

export { app, init, stop }
