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
  const user    = request.user as User;
  const guideId = request.params.id;

  const guide = await prisma.guide.findFirst({
    where: {
      id: guideId
    },
    include: {
      author: {
        select: { username: true }
      }
    }
  });

  if (guide === null) {
    return response.status(404).send({
      code   : 'guide-not-found',
      message: 'Guide not found'
    });
  }

  const favorite = await prisma.favorite.findFirst({
    where : {
      guideId,
      userId: user.id
    }
  });

  const isFavorite = favorite !== null;

  response.send({ ...guide, isFavorite });
};
