import { type Request, type Response } from 'express';
import { prisma }                      from '../index';

export const searchGuides = async (request: Request, response: Response) => {
  const query = request.query.query as string;

  const guides = await prisma.guide.findMany({
    where: {
      title: { contains: query, mode: 'insensitive' }
    },
    select: {
      id         : true,
      title      : true,
      description: true,
      emoji      : true
    }
  });

  response.send(guides);
};
