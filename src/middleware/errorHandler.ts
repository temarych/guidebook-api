import {
  type NextFunction,
  type Request,
  type Response
}                      from 'express';
import createHttpError from 'http-errors';

export const errorHandler = (error: unknown, request: Request, response: Response, next: NextFunction) => {
  if (createHttpError.isHttpError(error)) {
    response.status(error.status).send({ error: error.message });
    return next();
  }
  console.error(error);
};
