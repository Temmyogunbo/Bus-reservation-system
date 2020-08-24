import {objectType, extendType, stringArg, intArg} from '@nexus/schema'
import { Vehicle as VehicleModel } from '../../models/Vehicle';
import { Node} from './node'

const Vehicle= objectType({
  name:'Vehicle',
  definition(t) {
    t.implements(Node)
    t.string('name')
    t.string('model')
    t.int('numberOfSeats')
    t.string('yearOfManufacture')
    t.string('color')
  }
})

const VehicleQueries = extendType({
  type: 'Query',
  definition(t) {
    t.field('vehicles', {
      type: Vehicle,
      nullable: true,
      resolve: async (parent, args, ctx) => {
        const vehicles = await VehicleModel.findAll();
        return vehicles
      }
    })
  }
})

export { Vehicle, VehicleQueries }