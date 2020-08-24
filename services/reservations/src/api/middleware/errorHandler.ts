import express from 'express'
import { getOr } from 'lodash/fp'

export const logErrorHandler = (
  err: any,
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  console.error(getOr('logErrorHandler')('message')(err), err)
  return next(err)
}

export const errorHandler = (
  err: any,
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  const { status = 500, message } = err
  res.status(status || 500)
  res.json({ error: message })
}
