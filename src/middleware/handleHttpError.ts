import {
  type NextFunction,
  type Request,
  type Response
}                         from 'express';
import { type HttpError } from '../models/error';

export const handleHttpError = (
  error   : HttpError,
  request : Request,
  response: Response,
  next    : NextFunction
) => {
  response.status(error.status).send({
    code : error.code,
    error: error.message
  });
};
