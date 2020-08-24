import express from 'express'

import { upsertUser } from '../controller/user'

const userRouter = express.Router()

userRouter.post('/v1/user', upsertUser)

export { userRouter }