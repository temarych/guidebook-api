import { type Request }      from 'express';
import { JsonWebTokenError } from 'jsonwebtoken';
import createHttpError       from 'http-errors';
import { verifyToken }       from './token';
import { prisma }            from '../index';

export const authorize = async (request: Request) => {
  try {
    const accessToken = request.headers.authorization;

    if (accessToken === undefined || accessToken === '') {
      throw new createHttpError.Unauthorized('No access token provided');
    }

    const id   = verifyToken(accessToken);
    const user = await prisma.user.findFirst({ where: { id } });

    if (user === null) {
      throw new createHttpError.Unauthorized('No user found');
    }

    return user;
  } catch (error) {
    if (error instanceof JsonWebTokenError) {
      throw new createHttpError.Unauthorized(error.message);
    }
    throw error;
  }
};
