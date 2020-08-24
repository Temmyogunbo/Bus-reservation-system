import express from 'express'
import { signup, signin, getUser} from '../../controllers/authentication';

const authenticationRouter = express.Router()
authenticationRouter.post('/v1/signup', signup)
authenticationRouter.post('/v1/signin', signin)
authenticationRouter.get('/v1/auth', getUser)


export { authenticationRouter }