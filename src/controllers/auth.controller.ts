import { type Request, type Response } from 'express';
import bcrypt                          from 'bcrypt';
import { JsonWebTokenError }           from 'jsonwebtoken';
import { fromZodError }                from 'zod-validation-error';
import { ZodError, z }                 from 'zod';
import { Prisma }                      from '@prisma/client';
import { createAccessToken }           from '../services/token';
import { authorize }                   from '../services/authorize';
import { Profile }                     from '../models/profile';
import { HttpError }                   from '../models/error';
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
      throw new HttpError({
        status : 401,
        code   : 'auth/jwt',
        message: error.message
      });
    }
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      switch (error.code) {
        case 'P2002':
          throw new HttpError({
            status : 400,
            code   : 'auth/not-unique',
            message: 'Email or username are not unique'
          });
      }
    }
    if (error instanceof ZodError) {
      const validationError = fromZodError(error);
      throw new HttpError({
        status : 401,
        code   : 'auth/validation',
        message: validationError.message
      });
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
      throw new HttpError({
        status : 404,
        code   : 'auth/user-not-found',
        message: `User not found`
      });
    }

    const isCorrectPassword = await bcrypt.compare(data.password, user.password);

    if (!isCorrectPassword) {
      throw new HttpError({
        status : 401,
        code   : 'auth/invalid-password',
        message: `Password is not valid`
      });
    }

    const accessToken = createAccessToken(user.id);

    response.send({ accessToken });
  } catch (error) {
    if (error instanceof JsonWebTokenError) {
      throw new HttpError({
        status : 401,
        code   : 'auth/jwt',
        message: error.message
      });
    }
    if (error instanceof ZodError) {
      const validationError = fromZodError(error);
      throw new HttpError({
        status : 400,
        code   : 'auth/validation',
        message: validationError.message
      });
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
      throw new HttpError({
        status : 401,
        code   : 'auth/jwt',
        message: error.message
      });
    }
    if (error instanceof ZodError) {
      const validationError = fromZodError(error);
      throw new HttpError({
        status : 400,
        code   : 'auth/validation',
        message: validationError.message
      });
    }
    throw error;
  }
};
