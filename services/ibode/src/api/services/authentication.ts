import bcrypt from 'bcrypt';
import { isEmpty } from 'lodash/fp';

import { Authentication, IAuthenticationCreateAttributes } from '../../models/Authentication';
import { hashPassword } from '../helper/hashPassword';
const signup = async (user: IAuthenticationCreateAttributes) => {
  const {firstName, lastName, userName, email, password} = user;

  const auth = await Authentication.create({firstName, lastName, userName, email, password})
  return auth
}

const signin = async ({password, email}: Pick<IAuthenticationCreateAttributes, 'email' | 'password'>) => {
  try {
        const user = await Authentication.findOne({ where: { email } })
        const hash = hashPassword(password)
    if (isEmpty(user) || bcrypt.compareSync(user?.password, hash)) {
      throw Error('Invalid email or password')
    }
    return user
  } catch (error) {
    console.log(error)
  }
}

const getUser = async (id: string) => {
  try {
    const user = await Authentication.findByPk(id)

    if(isEmpty(user)) throw Error('user does not exist')
    return user
    
  } catch (error) {
    return error
    
  }
}

export { signin, signup, getUser }