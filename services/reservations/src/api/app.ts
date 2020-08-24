

import { RedisCache } from 'apollo-server-cache-redis'
import { ApolloServer, ReplaceFieldWithFragment } from 'apollo-server-express'
import responseCachePlugin from 'apollo-server-plugin-response-cache'
import bodyParser from 'body-parser'
import compression from 'compression'
import cors from 'cors'
import { default as express } from 'express'
import expressPlayground from 'graphql-playground-middleware-express'
import { pick } from 'lodash/fp'
import morgan from 'morgan'

import {
  DEFAULT_MAX_AGE_SECONDS,
  NODE_ENV,
  REDIS_URL,
} from '../config/env'
import { init as initGraphQLSchema } from './graphql'
import { isAuthenticated } from '../api/middleware/getUserInfo'
import { logErrorHandler, errorHandler } from '../api/middleware/errorHandler'
import { userRouter } from '../api/routes'

const graphQLSchema = initGraphQLSchema()

const app: express.Express = express()

app.use(morgan('combined'))
app.use(bodyParser.json({ limit: '50mb' }))
app.use(bodyParser.urlencoded({ extended: false }));

const cache = NODE_ENV !== 'test' ? new RedisCache(REDIS_URL as any) : undefined

const apolloServerOptions = {
  cacheControl: {
    defaultMaxAge: DEFAULT_MAX_AGE_SECONDS,
  },
  cache: NODE_ENV !== 'test' ? cache : undefined,
  schema: graphQLSchema,
  formatError: (err: Error & any) => {
    const meta = {
      code: err.extensions.code,
      query: err.originalError?.source?.body,
      ...pick(['name', 'locations', 'path', 'nodes'])(err),
    }

    if (err.message.startsWith('Warn:')) {
      console.log(err.message.substring(0, 255), meta)
    } else {
      console.error(err.message.substring(0, 255), meta)
    }

    // Otherwise return the original error.  The error can also
    // be manipulated in other ways, so long as it's returned.
    return err
  },
  plugins: NODE_ENV !== 'test' ? [responseCachePlugin({ cache })] : [],
}

const apolloServerOptionsDev = {
  ...apolloServerOptions,
  context: ({ req }) => ({
    email: req.user.email,
    userName: req.user.userName,
    firstName: req.user.firstName,
    lastName: req.user.lastName,
  }),
  tracing: true,
}

const apolloServerOptionsProd = {
  ...apolloServerOptions,
  context: ({ req }) => ({
    email: req.user.email,
    userName: req.user.userName,
    firstName: req.user.firstName,
    lastName: req.user.lastName,
    userId: req.user.id,
  }),  tracing: false,
}

// GraphiQL must be above "isAuthenticated" or we can't use it
// because GraphiQL won't have a valid token
// and we can't just skip checking for IsAuthenticated otherwise
// we loose populateUserInfo and that would cause some part of the app
// to stop working locally.
if (process.env.NODE_ENV !== 'production') {
  console.log('Use the /playground endpoint to run GraphQL queries on your browser.')
  const devServer = new ApolloServer(apolloServerOptionsDev)
  devServer.applyMiddleware({ app, path: '/graphqldev' })
  app.get('/playground', expressPlayground({ endpoint: '/graphqldev' }))
}
app.use(isAuthenticated)
app.use('/api', userRouter)
app.use(compression())
app.use(logErrorHandler) 
app.use(errorHandler)
const server = new ApolloServer(apolloServerOptionsProd)

server.applyMiddleware({ app })

export { app, apolloServerOptions }
