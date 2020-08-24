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
import { IBooking } from '../Booking';

interface IUserOnlyAttributes {
  firstName: string;
  lastName: string;
  email: string;
  userName: string;
}

interface IUserAttributes extends IUserOnlyAttributes, IBasicAttributes {}

interface IUserCreateAttributes extends IUserAttributes {}
interface IUserInstanceAttributes extends IUserOnlyAttributes, IBasicInstanceAttributes {
  bookings?: Array<IBooking>
}

interface IUser extends Sequelize.Instance<IUserInstanceAttributes>, IUserInstanceAttributes{}

interface IUserModel extends Sequelize.Model<IUser, IUserAttributes>{}
// create a location table so depart from and to can be from allowed locations

const schema: TSequelizeSchema<IUserAttributes> = {
  firstName: {
    type: Sequelize.STRING, allowNull: false
  },
  lastName: {
    type: Sequelize.STRING, allowNull: false,
  },
  userName: {
    type: Sequelize.STRING, allowNull: false
  },
  email: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true,
      notEmpty: true
    }
  },
}

const options = defaultOptions<IUser>({
  indexes: [{ fields: ['firstName'] }, { fields: ['lastName'] }, { fields: ['userName'] }, { fields: ['email'] }],
})

const User: IUserModel = sequelize.define<IUser, IUserAttributes, IUserCreateAttributes>('user', schema, options)

User.associate = (models: IModelsObj) => {
  User.hasMany(models.Booking, { as: 'bookings'})
}

export { User, IUserCreateAttributes, IUserAttributes, IUser}