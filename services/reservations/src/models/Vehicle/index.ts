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

interface IVehicleOnlyAttributes {
  name: string
  model: string
  color: string
  numbersOfSeats: number
  yearOfManufacture: string
}

interface IVehicleAttributes extends IVehicleOnlyAttributes, IBasicAttributes{}

interface IVehicleCreateAttributes extends IVehicleAttributes {}
interface IVehicleInstanceAttributes extends IVehicleOnlyAttributes, IBasicInstanceAttributes {}

interface IVehicle extends Sequelize.Instance<IVehicleInstanceAttributes>, IVehicleInstanceAttributes{}

interface IVehicleModel extends Sequelize.Model<IVehicle, IVehicleAttributes>{}
// create a location table so depart from and to can be from allowed locations

const schema: TSequelizeSchema<IVehicleAttributes> = {
  name: {
    type: Sequelize.STRING, allowNull: false
  },
  model: {
    type: Sequelize.STRING, allowNull: false,
  },
  color: {
    type: Sequelize.DATE, allowNull: false
  },
  numbersOfSeats: {
    type: Sequelize.INTEGER, allowNull: false
  },
  yearOfManufacture: {
    type: Sequelize.INTEGER, allowNull: false
  },
}

const options = defaultOptions<IVehicle>({
  indexes: [{ fields: ['name'] }, { fields: ['model'] }],
})

const Vehicle: IVehicleModel = sequelize.define<IVehicle, IVehicleAttributes, IVehicleCreateAttributes>('vehicle', schema, options)
Vehicle.associate = (models: IModelsObj) => {
  Vehicle.hasMany(models.Booking, {as: 'bookings', foreignKey: {allowNull: true}})
}

export {Vehicle, IVehicleCreateAttributes, IVehicle}