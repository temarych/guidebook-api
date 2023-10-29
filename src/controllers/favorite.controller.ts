import {
  type Request,
  type Response
}                    from 'express';
import { type User } from '@prisma/client';
import { prisma }    from '..';

export const addFavoriteGuide = async (request: Request, response: Response) => {
  const user    = request.user as User;
  const guideId = request.params.guideId;

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

export const removeFavoriteGuide = async (request: Request, response: Response) => {
  const user    = request.user as User;
  const guideId = request.params.guideId;

  const favorite = await prisma.favorite.findFirst({
    where: { guideId, userId: user.id }
  });

  if (favorite === null) {
    return response.status(400).send({
      code   : 'not-favorite',
      message: 'Guide is not favorite'
    });
  }

  await prisma.favorite.delete({
    where: { id: favorite.id }
  });

  response.send({
    message: 'Removed guide from favorites'
  });
};

export const getFavoriteGuides = async (request: Request, response: Response) => {
  const user = request.user as User;

  const favorites = await prisma.favorite.findMany({
    where  : {
      userId: user.id
    },
    include: {
      guide: {
        select: {
          id         : true,
          title      : true,
          description: true,
          emoji      : true
        }
      }
    }
  });

  response.send(favorites.map(favorite => favorite.guide));
};
