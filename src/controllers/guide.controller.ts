import { type Request, type Response } from 'express';
import { z }                           from 'zod';
import { authorize }                   from '../services/authorize';
import { prisma }                      from '../index';

const createGuideSchema = z.object({
  title      : z.string(),
  emoji      : z.string().emoji(),
  description: z.string(),
  image      : z.string()
});

export const createGuide = async (request: Request, response: Response) => {
  const user  = await authorize(request);
  const data  = createGuideSchema.parse(request.body);

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
