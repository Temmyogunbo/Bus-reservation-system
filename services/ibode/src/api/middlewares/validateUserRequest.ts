import { Request, Response , NextFunction} from 'express'

export const validateUserRequest = (request: Request, response: Response, next: NextFunction) => {
  if (request.url === '/api/v1/users/signin'
  && request.method === 'POST') {
    request.check('password', 'Password is required').notEmpty();
    request.check(
      'password',
      'Password must be a mininum of 5 characters',
    ).isLength({ min: 5 });
    request.check('userName', 'Username is required').notEmpty();
    const errors = request.validationErrors();
    if (errors) {
      return response.status(400).json({ error: errors[0] });
    }
    next();
  } else if (request.url === '/api/v1/users/change-password' &&
  request.method === 'PUT') {
    request.check('oldPassword', 'This field is required').notEmpty();
    request.check('newPassword', 'This field is required').notEmpty();
    request.check(
      'newPassword',
      'New password must be a mininum of 5 characters',
    ).isLength({ min: 5 });
    const errors = request.validationErrors();
    if (errors) {
      return response.status(400).json({ error: errors[0] });
    }
    next();
  } else {
    request.check('fullName', 'Fullname is required').notEmpty();
    request.check('userName', 'Username is required').notEmpty();
    request.check('email', 'Email is required').notEmpty();
    request.check('email', 'Please put a valid email').isEmail();
    request.check('password', 'Password is required').notEmpty();
    request.check(
      'password',
      'Password must be a mininum of 5 characters',
    ).isLength({ min: 5 });
    const errors = request.validationErrors();
    if (errors) {
      return response.status(400).json({ error: errors[0] });
    }
    next();
  }
}