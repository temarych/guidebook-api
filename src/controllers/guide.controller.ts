import { type Request, type Response } from 'express';
import { type User }                   from '@prisma/client';
import { type ICreateGuideSchema }     from '../models/guide';
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
  const id = request.params.id;

  const guide = await prisma.guide.findFirst({
    where: { id }
  });

  response.send(guide);
};
