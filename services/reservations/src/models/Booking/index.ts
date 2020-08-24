import { Sequelize, sequelize } from '../../config/sequelize'
import {
  defaultOptions,
  IBasicAttributes,
  IBasicInstanceAttributes,
  IModelsObj,
  IMyDefineIndexOptions,
  TAddInstanceFn,
  TAddInstancesFn,
  TAddInstancesThroughFn,
  TAddInstanceThroughFn,
  TGetInstancesFn,
  TRemoveInstanceFn,
  TSequelizeSchema,
} from '../common'

interface IBookingOnlyAttributes {
  departFrom: string
  departTo: string
  departureDate: string
  seatNo: number
  vehicleId: number
  userId: string
  confirmed: boolean
}

interface IBookingAttributes extends IBookingOnlyAttributes, IBasicAttributes {}

interface IBookingCreateAttributes extends IBookingAttributes {}
interface IBookingInstanceAttributes extends IBookingOnlyAttributes, IBasicInstanceAttributes {}

interface IBooking extends Sequelize.Instance<IBookingInstanceAttributes>, IBookingInstanceAttributes{}

interface  IBookingModel extends Sequelize.Model<IBooking, IBookingAttributes, IBookingCreateAttributes>{}
// create a location table so depart from and to can be from allowed locations

const schema: TSequelizeSchema<IBookingAttributes> = {
  departFrom: {
    type: Sequelize.STRING, allowNull: false
  },
  departTo: {
    type: Sequelize.STRING, allowNull: false,
  },
  departureDate: {
    type: Sequelize.DATE, allowNull: false
  },
  seatNo: {
    type: Sequelize.INTEGER, allowNull: false
  },
  vehicleId: {
    type: Sequelize.INTEGER, allowNull: true
  },
  userId: {
    type: Sequelize.INTEGER, allowNull: true
  },
  confirmed: {
    type: Sequelize.BOOLEAN,
    defaultValue: true,
  },
}

const options = defaultOptions<IBooking>({
  indexes: [{ fields: ['departFrom'] }, { fields: ['departTo'] }, { fields: ['departureDate'] }],
})

const Booking: IBookingModel = sequelize.define<IBooking, IBookingAttributes, IBookingCreateAttributes>('booking', schema, options);
Booking.associate = (models: IModelsObj) => {
  Booking.belongsTo(models.User, {foreignKey: {allowNull: true}, as: 'user'})
  Booking.belongsTo(models.Vehicle, {as: 'vehicle', foreignKey: {allowNull: true}})
}

export { Booking, IBookingCreateAttributes, IBooking, IBookingAttributes}