import { each, keys } from 'lodash/fp'

import { Sequelize, sequelize } from '../config/sequelize'
import { Authentication } from './Authentication';

const models = {
Authentication
} as const

type TModels = typeof models
type TModelName = keyof TModels
type TModel = typeof models[TModelName]

each((modelName: TModelName): void => {
  const model = models[modelName]
  if (model.associate) model.associate(models)
})(keys(models))

export {Sequelize, sequelize, TModel}
