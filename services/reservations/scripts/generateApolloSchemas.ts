import '../src/config/env'

import { makeSchema } from '@nexus/schema'

import { schemaOptions } from '../src/api/graphql'

makeSchema(schemaOptions)

setTimeout(() => process.exit(), 3000)
