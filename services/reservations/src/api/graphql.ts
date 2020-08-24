import { makeSchema} from '@nexus/schema'
import path from 'path'

import { User, UserMutations, UserQueries } from './graphql/user';
import { Booking, BookingMutation } from './graphql/booking';
import { Vehicle, VehicleQueries } from './graphql/vehicle';

const schemaOptions = {
  types: [User, UserMutations, UserQueries, Booking, BookingMutation, Vehicle, VehicleQueries],
  outputs: {
    schema: path.join(__dirname, '../../schema.graphql'),
    typegen: path.join(__dirname, '../../types/my-generated-types.d.ts'),
  },
}
const init = () => {
  const schema = makeSchema(schemaOptions)
  return schema
}

export { init, schemaOptions }