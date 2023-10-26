import {
  type NextFunction,
  type Request,
  type Response
}                    from 'express';
import { HttpError } from '../models/error';

export const handleHttpError = (
  error   : unknown,
  request : Request,
  response: Response,
  next    : NextFunction
) => {
  if (error instanceof HttpError) {
    return response.status(error.status).send({
      code : error.code,
      error: error.message
    });
  }
  throw error;
};
