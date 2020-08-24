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
import { hashPassword } from '../../api/helper/hashPassword';
interface IAuthenticationOnlyAttributes {
  firstName: string;
  lastName: string;
  password: string;
  email: string;
  userName: string;
  active?: boolean;
}

interface IAuthenticationAttributes extends IAuthenticationOnlyAttributes, IBasicAttributes {}

interface IAuthenticationCreateAttributes extends IAuthenticationAttributes {}
interface IAuthenticationInstanceAttributes extends IAuthenticationOnlyAttributes, IBasicInstanceAttributes {
}

interface IAuthentication extends Sequelize.Instance<IAuthenticationInstanceAttributes>, IAuthenticationInstanceAttributes{}

interface IAuthenticationModel extends Sequelize.Model<IAuthentication, IAuthenticationAttributes>{}
// create a location table so depart from and to can be from allowed locations

const schema: TSequelizeSchema<IAuthenticationAttributes> = {
  firstName: {
    type: Sequelize.STRING, allowNull: false
  },
  lastName: {
    type: Sequelize.STRING, allowNull: false,
  },
  userName: {
    type: Sequelize.STRING, allowNull: false, unique: true,
  },
  password: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
      min: 5
    }
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
  active: {
    type: Sequelize.BOOLEAN,
    defaultValue: true
  },
}

const beforeCreate = (auth: IAuthentication) => {
  auth.password = hashPassword(auth.password)
}

const options = defaultOptions<IAuthentication>({
  hooks: {
    beforeCreate
  },
  indexes: [{ fields: ['firstName'] }, { fields: ['lastName'] }, { fields: ['userName'] }],
})

const Authentication: IAuthenticationModel = sequelize.define<IAuthentication, IAuthenticationAttributes, IAuthenticationCreateAttributes>('authentications', schema, options)

export { Authentication, IAuthenticationCreateAttributes, IAuthenticationAttributes, IAuthentication}