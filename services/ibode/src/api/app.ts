import bodyParser from 'body-parser'
import express from 'express'
import morgan from 'morgan';

import { errorHandler, logErrorHandler } from './middlewares/errorHandler'
import { authenticationRouter } from './routes'


const app: express.Express = express()

app.use(morgan('combined'))
app.use(bodyParser.json({ limit: '50mb' }))
app.use(bodyParser.urlencoded({ extended: false }));

app.use('/api', authenticationRouter)

app.use(logErrorHandler) 
app.use(errorHandler)

export { app }
