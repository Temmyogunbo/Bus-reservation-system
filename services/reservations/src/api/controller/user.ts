import { Request, Response } from 'express'

import { upsert } from '../services/user'

const upsertUser = async (req: Request, res: Response) => {
  const {userName, email, firstName, lastName} = req.body

  try {
    const user = await upsert({userName, email, firstName, lastName})

    return res.status(201).json({
      user,
      success: true,
      message: 'Upsert successful',
    });
    
  } catch (error) {
      res.status(500).json({
        message: 'An error occured',
      });
  }
}

export { upsertUser }