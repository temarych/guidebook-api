import { type Request }      from 'express';
import { JsonWebTokenError } from 'jsonwebtoken';
import { HttpError }         from '../models/error';
import { verifyToken }       from './token';
import { prisma }            from '../index';

export const authorize = async (request: Request) => {
  try {
    const accessToken = request.headers.authorization;

    if (accessToken === undefined || accessToken === '') {
      throw new HttpError({
        status : 401,
        code   : 'auth/jwt',
        message: 'No access token provided'
      });
    }

    const id   = verifyToken(accessToken);
    const user = await prisma.user.findFirst({ where: { id } });

    if (user === null) {
      throw new HttpError({
        status : 404,
        code   : 'auth/user-not-found',
        message: 'No user found'
      });
    }

    return user;
  } catch (error) {
    if (error instanceof JsonWebTokenError) {
      throw new HttpError({
        status : 401,
        code   : 'auth/jwt',
        message: error.message
      });
    }
    throw error;
  }
};
