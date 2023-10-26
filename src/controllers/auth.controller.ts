import { type Request, type Response } from 'express';
import bcrypt                          from 'bcrypt';
import { z }                           from 'zod';
import { createAccessToken }           from '../services/token.service';
import { authorize }                   from '../services/auth.service';
import { Profile }                     from '../models/profile';
import { HttpError }                   from '../models/error';
import { prisma }                      from '../index';

const signUpSchema = z.object({
  username: z.string(),
  email   : z.string(),
  password: z.string()
});

export const signUp = async (request: Request, response: Response) => {
  const data = signUpSchema.parse(request.body);

  const password = await bcrypt.hash(data.password, 10);
  const user     = await prisma.user.create({ data: { ...data, password } });

  const accessToken = createAccessToken(user.id);

  response.send({ accessToken });
};

const signInSchema = z.object({
  email   : z.string(),
  password: z.string()
});

export const signIn = async (request: Request, response: Response) => {
  const data = signInSchema.parse(request.body);

  const user = await prisma.user.findFirst({
    where: { email: data.email }
  });

  if (user === null) {
    throw new HttpError({
      status : 404,
      code   : 'user-not-found',
      message: `User not found`
    });
  }

  const isCorrectPassword = await bcrypt.compare(data.password, user.password);

  if (!isCorrectPassword) {
    throw new HttpError({
      status : 401,
      code   : 'invalid-password',
      message: `Password is not valid`
    });
  }

  const accessToken = createAccessToken(user.id);

  response.send({ accessToken });
};

export const getMe = async (request: Request, response: Response) => {
  const user    = await authorize(request);
  const profile = new Profile(user);

  response.send({ ...profile });
};
