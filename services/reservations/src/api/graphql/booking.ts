import {objectType, extendType, stringArg, intArg} from '@nexus/schema'
import { Booking as BookingModel } from '../../models/Booking';
import { Node} from './node'

const Booking = objectType({
  name:'Booking',
  definition(t) {
    t.implements(Node)
    t.string('departFrom')
    t.string('departTo')
    t.int('seatNo')
    t.int('vehicleId')
    t.string('userId')
    t.string('departureDate')
  }
})

const BookingMutation = extendType({
  type: 'Mutation',
  definition(t) {
    t.field('createBooking',{
      type: Booking,
      args: {
        departFrom: stringArg({required: true}),
        departTo: stringArg({required: true}),
        seatNo: intArg({required: true}),
        vehicleId: intArg({required: true}),
        userId: stringArg({required: true}),
        departureDate: stringArg({required: true}),
      },
      resolve: async (parent, args, ctx) => {
        const booking = await BookingModel.create({...args}) 
        console.log({booking})
        return booking;
      }
    })
  }
})
export { Booking, BookingMutation }