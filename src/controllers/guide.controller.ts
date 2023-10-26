import { type Request, type Response } from 'express';
import createHttpError                 from 'http-errors';
import { ZodError, z }                 from 'zod';
import { prisma }                      from '../index';

const createGuideSchema = z.object({
  title: z.string()
});

export const createGuide = async (request: Request, response: Response) => {
  try {
    const data  = createGuideSchema.parse(request.body);
    const guide = await prisma.guide.create({ data });

    response.send(guide);
  } catch (error) {
    if (error instanceof ZodError) {
      throw new createHttpError.BadRequest('Invalid request body');
    }
    throw error;
  }
};
