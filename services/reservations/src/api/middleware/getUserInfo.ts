import { Request, Response, NextFunction } from 'express'
import axios from 'axios';
import { get, includes, toLower} from 'lodash/fp';

import { AUTH_URL } from '../../config/env';

class ValidationError extends Error {
  public status = 401
  constructor(message = 'Could not validate user scope') {
    super(message)
  }
}

const fetchUser = async (token: string) => {
  if(token) {

    return axios.get(`${AUTH_URL}/auth`, {
      headers: {
        authorization: token,
        'content-type': 'application/json',
    }}).then((res: Request.Response) => res.data).catch((res: any) => Promise.reject(res.error || res))
    
  }
}
  const isAuthenticated = async (req: Request, res: Response, next: NextFunction
    ) => {
      const { authorization} = req.headers
      if (!authorization) next(new ValidationError('No token provided'))
      else {
        try {
          const user: any = await fetchUser(req.headers.authorization as string)
          if (user) {
            Object.assign(req, { user })
            next()
          } else next(new ValidationError('Could not validate role'))
        } catch (err) {
          const bodyErrorMessage = get('response.body.error')(err)
          // Pass over error message for expired tokens.
          if (includes('jwt')(toLower(bodyErrorMessage))) {
            err.code = err.response.statusCode
            err.message = bodyErrorMessage
            err.auth = req.headers.authorization
          }
    
          next(err)
        }
      }
  }


export { isAuthenticated }