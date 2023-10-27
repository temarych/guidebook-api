import {
  type Request,
  type Response
}                    from 'express';
import { type User } from '@prisma/client';
import { prisma }    from '..';

export const addFavoriteGuide = async (request: Request, response: Response) => {
  const user            = request.user as User;
  const { id: guideId } = request.params;

  const favorite = await prisma.favorite.findFirst({
    where: { guideId, userId: user.id }
  });

  if (favorite !== null) {
    return response.status(400).send({
      code   : 'already-favorite',
      message: 'Guide is already favorite'
    });
  }

  await prisma.favorite.create({
    data: { guideId, userId: user.id }
  });

  response.send({
    message: 'Added guide to favorites'
  });
};

export const getFavoriteGuides = async (request: Request, response: Response) => {
  const user = request.user as User;

  const favorites = await prisma.favorite.findMany({
    where  : { userId: user.id },
    include: {
      guide: {
        include: {
          author: { select: { username: true } }
        }
      }
    }
  });

  response.send(favorites.map(favorite => favorite.guide));
};
