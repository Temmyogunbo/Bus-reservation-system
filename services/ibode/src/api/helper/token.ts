import { sign, verify } from 'jsonwebtoken'
import {flow } from 'lodash/fp'

import { IAuthenticationCreateAttributes } from '../../models/Authentication';
import { SECRET_KEY } from '../../config/env';

const removeBearer = (token: string) => {
  const splitToken = token.split(' ')
  if(splitToken.includes('Bearer')) return splitToken[1]
  return token
}
const getToken = (user: Partial<IAuthenticationCreateAttributes>) => sign(user, SECRET_KEY, {
    expiresIn: 3600 * 24,
  });

  const decodeToken = (token: string) => flow(removeBearer, (token) => verify(token, SECRET_KEY, { algorithms: ['HS256'] }))(token)

  export {getToken, decodeToken}
