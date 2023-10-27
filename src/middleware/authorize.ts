import {
  type Request,
  type Response,
  type NextFunction
}                      from 'express';
import {
  JsonWebTokenError,
  TokenExpiredError
}                      from 'jsonwebtoken';
import { HttpError }   from '../models/error';
import { verifyToken } from '../utils/token';
import { prisma }      from '../index';

export const authorize = async (
  request : Request,
  response: Response,
  next    : NextFunction
) => {
  try {
    const accessToken = request.headers.authorization;

    if (accessToken === undefined) {
      throw new HttpError({
        status : 401,
        code   : 'no-jwt',
        message: 'No access token provided'
      });
    }

    const id   = verifyToken(accessToken);
    const user = await prisma.user.findFirst({ where: { id } });

    if (user === null) {
      throw new HttpError({
        status : 404,
        code   : 'user-not-found',
        message: 'No user found'
      });
    }

    request.user = user;

    return next();
  } catch (error) {
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
        message: 'Access token is expired'
      });
    }

    throw error;
  }
};
