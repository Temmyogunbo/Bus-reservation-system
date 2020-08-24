import bcrypt from 'bcrypt';

export const hashPassword = (password: string) => bcrypt.hashSync(password, bcrypt.genSaltSync(10))
