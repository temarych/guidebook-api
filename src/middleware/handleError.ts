import {
  type NextFunction,
  type Request,
  type Response
}                       from 'express';
import { ZodError }     from 'zod';
import { fromZodError } from 'zod-validation-error';
import {
  TokenExpiredError,
  JsonWebTokenError
}                       from 'jsonwebtoken';
import { HttpError }    from '../models/error';

export const handleError = (
  error   : unknown,
  request : Request,
  response: Response,
  next    : NextFunction
) => {
  if (error instanceof ZodError) {
    throw new HttpError({
      status : 400,
      code   : 'invalid-request',
      message: fromZodError(error).message
    });
  }

  if (error instanceof JsonWebTokenError) {
    throw new HttpError({
      status : 401,
      code   : 'jwt-invalid',
      message: 'Access token is not valid'
    });
  }

  if (error instanceof TokenExpiredError) {
    throw new HttpError({
      status : 401,
      code   : 'jwt-expired',
      message: 'Access token expired'
    });
  }

  console.error(error);

  throw new HttpError({
    status : 500,
    code   : 'internal',
    message: 'Internal server error'
  });
};
