import { type Request, type Response } from 'express';
import bcrypt                          from 'bcrypt';
import createHttpError                 from 'http-errors';
import { JsonWebTokenError }           from 'jsonwebtoken';
import { fromZodError }                from 'zod-validation-error';
import { ZodError, z }                 from 'zod';
import { Prisma }                      from '@prisma/client';
import { createAccessToken }           from '../services/token';
import { authorize }                   from '../services/authorize';
import { Profile }                     from '../models/profile';
import { prisma }                      from '../index';

const signUpSchema = z.object({
  username: z.string(),
  email   : z.string(),
  password: z.string()
});

export const signUp = async (request: Request, response: Response) => {
  try {
    const data        = signUpSchema.parse(request.body);
    const password    = await bcrypt.hash(data.password, 10);
    const user        = await prisma.user.create({ data: { ...data, password } });
    const accessToken = createAccessToken(user.id);

    response.send({ accessToken });
  } catch (error) {
    if (error instanceof JsonWebTokenError) {
      throw new createHttpError.Unauthorized(error.message);
    }
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      switch (error.code) {
        case 'P2002':
          throw new createHttpError.BadRequest('Email or username are not unique');
      }
    }
    if (error instanceof ZodError) {
      const validationError = fromZodError(error);
      throw new createHttpError.BadRequest(validationError.message);
    }
    throw error;
  }
};

const signInSchema = z.object({
  email   : z.string(),
  password: z.string()
});

export const signIn = async (request: Request, response: Response) => {
  try {
    const data = signInSchema.parse(request.body);

    const user = await prisma.user.findFirst({
      where: { email: data.email }
    });

    if (user === null) {
      throw new createHttpError.BadRequest(`User doesn't exist`);
    }

    const isCorrectPassword = await bcrypt.compare(data.password, user.password);

    if (!isCorrectPassword) {
      throw new createHttpError.BadRequest(`Invalid password`);
    }

    const accessToken = createAccessToken(user.id);

    response.send({ accessToken });
  } catch (error) {
    if (error instanceof JsonWebTokenError) {
      throw new createHttpError.Unauthorized(error.message);
    }
    if (error instanceof ZodError) {
      const validationError = fromZodError(error);
      throw new createHttpError.BadRequest(validationError.message);
    }
    throw error;
  }
};

export const getMe = async (request: Request, response: Response) => {
  try {
    const user    = await authorize(request);
    const profile = new Profile(user);

    response.send({ ...profile });
  } catch (error) {
    if (error instanceof JsonWebTokenError) {
      throw new createHttpError.Unauthorized(error.message);
    }
    if (error instanceof ZodError) {
      const validationError = fromZodError(error);
      throw new createHttpError.BadRequest(validationError.message);
    }
    throw error;
  }
};
