import { User, IUser, IUserCreateAttributes } from '../../models/User';

const upsert = (user: IUserCreateAttributes) => {
  return User.upsert(user)
}

export { upsert }