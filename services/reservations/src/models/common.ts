import { omit } from 'lodash/fp'
import {
  CreateOptions,
  DataTypeAbstract,
  DefineAttributeColumnOptions,
  DefineIndexesOptions,
  DefineOptions,
  DestroyOptions,
  fn,
  Model,
} from 'sequelize'

import { NODE_ENV } from '../config/env'

type TSequelizeAttribute = string | DataTypeAbstract | DefineAttributeColumnOptions

type TSequelizeSchema<T extends {}> = {
  [P in keyof T]: TSequelizeAttribute
}

interface IBasicAttributes {
  createdAt?: Date
  id?: number
  // uid?: string
  updatedAt?: Date
  deletedAt?: Date
}

interface IBasicInstanceAttributes extends Required<Omit<IBasicAttributes, 'deletedAt'>> {
  deletedAt?: Date
}

interface IModelsObj {
  [key: string]: Model<any, any>
}

type TAddInstance<T> = T | number | string
type TRemoveInstance<T> = T | number | string
type TAddInstanceFn<T> = (instance: TAddInstance<T>, opts?: CreateOptions) => Promise<void>
type TRemoveInstanceFn<T> = (instance: TRemoveInstance<T>, opts?: DestroyOptions) => Promise<void>

type TAddInstances<T> = TAddInstance<T> | Array<TAddInstance<T>>
type TAddInstancesFn<T> = (instances: TAddInstances<T>, opts?: CreateOptions) => Promise<void>

type TRemoveInstances<T> = TRemoveInstance<T> | Array<TRemoveInstance<T>>
type TRemoveInstancesFn<T> = (
  instances: TRemoveInstances<T>,
  opts?: DestroyOptions
) => Promise<void>

// V is the type of the join model
type CreateOptionsThrough<T> = CreateOptions & { through: Partial<T> }
type TAddInstanceThroughFn<T, V> = (
  instance: TAddInstance<T>,
  opts?: CreateOptionsThrough<V>
) => Promise<void>
type TAddInstancesThroughFn<T, V> = (
  instances: TAddInstances<T>,
  opts?: CreateOptionsThrough<V>
) => Promise<void>

type DestroyOptionsThrough<T> = DestroyOptions & { through: Partial<T> }
type TRemoveInstanceThroughFn<T, V> = (
  instance: TRemoveInstance<T>,
  opts?: DestroyOptionsThrough<V>
) => Promise<void>
type TRemoveInstancesThroughFn<T, V> = (
  instances: TRemoveInstances<T>,
  opts?: DestroyOptionsThrough<V>
) => Promise<void>

type TGetInstanceFn<T> = () => Promise<T | null>
type TGetInstancesFn<T> = () => Promise<Array<T>>

type TAttributeOf<T> = Extract<keyof T, string>

interface IMyDefineIndexOptions<T> extends Omit<DefineIndexesOptions, 'fields'> {
  fields?: Array<
    TAttributeOf<T> | fn | { attribute: string; length: number; order: string; collate: string }
  >
}

interface IMyDefineOptions<T> extends Omit<DefineOptions<T>, 'indexes'> {
  indexes?: Array<IMyDefineIndexOptions<T>>
}

const defaultOptions = <T>(options: IMyDefineOptions<T>): DefineOptions<T> => {
  const indexes: Array<IMyDefineIndexOptions<T & IBasicAttributes>> = [
    ...(options.indexes || []),
    { fields: ['createdAt'] },
    { fields: ['updatedAt'] },
    ...(options.paranoid === false
      ? []
      : ([{ fields: ['deletedAt'] }] as Array<IMyDefineIndexOptions<T>>)),
    // { fields: ['uid'] },
  ]

  return {
    paranoid: true,
    timestamps: true,
    indexes: NODE_ENV === 'test' ? undefined : indexes,
    ...omit(['indexes'])(options),
  }
}

export {
  defaultOptions,
  IBasicAttributes,
  IBasicInstanceAttributes,
  IModelsObj,
  IMyDefineIndexOptions,
  IMyDefineOptions,
  TAddInstanceFn,
  TAddInstancesFn,
  TAddInstancesThroughFn,
  TAddInstanceThroughFn,
  TGetInstanceFn,
  TGetInstancesFn,
  TRemoveInstanceFn,
  TRemoveInstancesFn,
  TRemoveInstancesThroughFn,
  TRemoveInstanceThroughFn,
  TSequelizeSchema,
}
