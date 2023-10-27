import {
  type NextFunction,
  type Request,
  type Response
}                         from 'express';
import { HttpError } from '../models/error';

export const handleError = (
  error   : Error,
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

  console.error(error);

  response.status(500).send({
    code : 500,
    error: error.message
  });
};
