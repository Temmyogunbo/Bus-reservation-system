import { Request, Response } from 'express'

import * as Authentication from '../../services/authentication';
import { getToken, decodeToken } from '../../helper/token';
import {  IAuthentication } from '../../../models/Authentication';

const signup = async (req: Request, res: Response) => {
  const {firstName, lastName, email, password, userName } = req.body

  try {
    
    const auth =  await Authentication.signup({firstName, lastName, email, password, userName })
    const {id} = auth
    const token = getToken({firstName, lastName, email, userName })

    return res.status(201).json({
      id,
      firstName, 
      lastName, 
      email,
      userName,
      token,
      success: true,
      message: 'Registration successful',
    });
  } catch (error) {
    if (error.name === 'SequelizeUniqueConstraintError') {
      if (error.fields.userName) {
        res.status(409).json({
          message: 'Username already exist.',
        });
      } else if (error.fields.email) {
        res.status(409).json({
          message: 'Email has been taken.',
        });
      } else {
        res.status(500).json({
          message: 'An error occured',
        });
      }
    
  }
  }
}

const signin = async (req: Request, res: Response) => {
  const {email, password} = req.body
  try {
    const {userName, firstName, lastName, id }: IAuthentication = await Authentication.signin({email, password})
    const token = getToken({userName, firstName, lastName, email, id})

    if (token) {
      return res.status(200).json({
        userName,
        id,
        firstName,
        lastName,
        email,
        token,
        success: true,
        message: 'You are signed in',
      });
  } else {
    return res.status(401).json({
      success: false,
      message: 'Invalid username or password',
    });
  }
  } catch (error) {
    res.status(500).json({
      message: 'An error occured',
      error,
    });
  }
  } 

  const getUser = async (req: Request, res: Response) => {
    if (!req.headers.authorization) throw new Error('No token provided')

    const decodedToken = decodeToken(req.headers.authorization)
    const { id: userId } = decodedToken
    try {
      const {email, userName, firstName, lastName, id, } = await Authentication.getUser(userId)
      if (email) {
        return res.status(200).json({
          userName,
          id,
          firstName,
          lastName,
          email,
          success: true,
          message: 'valid user',
        });
    } else {
      return res.status(500).json({
        success: false,
        message: 'An error occur',
      });
    }

    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'An error occur',
      });
    }
  }


export { signin, signup, getUser}