import { type Request } from 'express';
import { HttpError }    from '../models/error';
import { verifyToken }  from './token.service';
import { prisma }       from '../index';

export const authorize = async (request: Request) => {
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

  return user;
};
