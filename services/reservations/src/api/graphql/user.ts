import { objectType, extendType, stringArg, intArg } from '@nexus/schema';
import { Node} from './node'
import { Booking } from './booking';
import { Booking as BookingModel} from '../../models/Booking'
import { User as UserModel } from '../../models/User';

const User = objectType({
  name: 'User',
  definition(t) {
    t.implements(Node)
    t.string('firstName')
    t.string('lastName')
    t.list.field('bookings', {
      type: Booking,
      nullable: true,
      //@ts-ignore
      resolve: async (parent, args, ctx, info) => {
        const bookings = await BookingModel.findAll({where: {userId: ctx.userId}});
        return bookings
      }
    })
  }
})

const UserQueries = extendType({
  type: 'Query',
  definition(t) {
    t.field('users', {
      type: User,
      nullable: true,
      //@ts-ignore
      resolve: async (parent, arg, ctx) => {
        const user = await UserModel.findAll();
        return user
      }
    })
  }
})

const UserMutations = extendType({
  type: 'Mutation',
  definition(t) {
    t.field('signup', {
      type: User,
      nullable: false,
      args: {
        firstName: stringArg({required: true, }),
        lastName: stringArg({required: true}),
      },
      resolve: async (parent, args, ctx) => {
        //@ts-ignore
        const user = await UserModel.create({...args})
        return user;
      }
    })
  }
})

export {UserQueries, UserMutations, User}