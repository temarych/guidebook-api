import { type Request, type Response } from 'express';
import { type User }                   from '@prisma/client';
import {
  type ICreateStepSchema,
  type ICreateGuideSchema
}                                      from '../schemas/guide.schema';
import { prisma }                      from '../index';

export const createGuide = async (request: Request, response: Response) => {
  const user = request.user as User;
  const data = request.body as ICreateGuideSchema;

  const guide = await prisma.guide.create({
    data: { ...data, authorId: user.id }
  });

  response.send(guide);
};

export const getGuide = async (request: Request, response: Response) => {
  const user    = request.user as User;
  const guideId = request.params.guideId;

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

export const getSteps = async (request: Request, response: Response) => {
  const guideId = request.params.guideId;

  const guide = await prisma.guide.findFirst({
    where: { id: guideId }
  });

  if (guide === null) {
    return response.status(404).send({
      code   : 'guide-not-found',
      message: 'Guide not found'
    });
  }

  const steps = await prisma.step.findMany({
    where  : { guideId },
    orderBy: { order: 'asc' }
  });

  response.send(steps);
};

export const addStep = async (request: Request, response: Response) => {
  const data    = request.body as ICreateStepSchema;
  const guideId = request.params.guideId;

  const guide = await prisma.guide.findFirst({
    where: { id: guideId }
  });

  if (guide === null) {
    return response.status(404).send({
      code   : 'guide-not-found',
      message: 'Guide not found'
    });
  }

  const { _max: { order } } = await prisma.step.aggregate({
    where: { guideId },
    _max : { order: true }
  });

  const step = await prisma.step.create({
    data: {
      ...data,
      guideId,
      order: order !== null ? order + 1 : 1
    }
  });

  response.send(step);
};
