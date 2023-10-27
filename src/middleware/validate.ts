import {
  type Request,
  type Response,
  type NextFunction
}                       from 'express';
import {
  ZodError,
  type Schema
}                       from 'zod';
import { fromZodError } from 'zod-validation-error';
import { HttpError }    from '../models/error';

export const validate = <T>(schema: Schema<T>) => (
  request : Request,
  response: Response,
  next    : NextFunction
) => {
  try {
    schema.parse(request.body);
    return next();
  } catch (error) {
    if (error instanceof ZodError) {
      throw new HttpError({
        status : 400,
        code   : 'invalid-request-body',
        message: fromZodError(error).message
      });
    }
    throw error;
  }
};
