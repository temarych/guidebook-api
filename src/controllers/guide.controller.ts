import { type Request, type Response } from 'express';
import { type User }                   from '@prisma/client';
import { type ICreateGuideSchema }     from '../schemas/guide.schema';
import { prisma }                      from '../index';

export const createGuide = async (request: Request, response: Response) => {
  const user  = request.user as User;
  const data  = request.body as ICreateGuideSchema;

  const guide = await prisma.guide.create({
    data: { ...data, authorId: user.id }
  });

  response.send(guide);
};

export const getGuide = async (request: Request, response: Response) => {
  const user = request.user as User;
  const id   = request.params.id;

  const guide = await prisma.guide.findFirst({
    where  : { id },
    include: {
      author: {
        select: { username: true }
      },
      favorite: {
        where: { userId: user.id }
      }
    }
  });

  if (guide === null) {
    return response.status(404).send({
      code   : 'guide-not-found',
      message: 'Guide not found'
    });
  }

  response.send({
    id         : guide.id,
    emoji      : guide.emoji,
    title      : guide.title,
    description: guide.description,
    image      : guide.image,
    authorId   : guide.authorId,
    author     : guide.author,
    isFavorite : guide.favorite.length > 0
  });
};
