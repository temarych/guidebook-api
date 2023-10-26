import { type Request, type Response } from 'express';
import createHttpError                 from 'http-errors';
import { Prisma }                      from '@prisma/client';
import { ZodError, z }                 from 'zod';
import { fromZodError }                from 'zod-validation-error';
import { prisma }                      from '../index';

const createGuideSchema = z.object({
  title      : z.string(),
  emoji      : z.string().emoji(),
  description: z.string(),
  image      : z.string()
});

export const createGuide = async (request: Request, response: Response) => {
  try {
    const data  = createGuideSchema.parse(request.body);
    const guide = await prisma.guide.create({ data });

    response.send(guide);
  } catch (error) {
    if (error instanceof ZodError) {
      const validationError = fromZodError(error);
      throw new createHttpError.BadRequest(validationError.message);
    }
    throw error;
  }
};

export const getGuide = async (request: Request, response: Response) => {
  try {
    const id = request.params.id;

    const guide = await prisma.guide.findFirst({
      where: { id }
    });

    response.send(guide);
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      throw new createHttpError.BadRequest('Invalid id');
    }
    throw error;
  }
};
