import {
  type Request,
  type Response
}                            from 'express';
import bcrypt                from 'bcrypt';
import { type User }         from '@prisma/client';
import { createAccessToken } from '../utils/token';
import {
  type ISignInSchema,
  type ISignUpSchema
}                            from '../schemas/auth.schema';
import { prisma }            from '../index';

export const signUp = async (request: Request, response: Response) => {
  const data = request.body as ISignUpSchema;

  const userWithSuchEmail = await prisma.user.findFirst({
    where: { email: data.email }
  });

  if (userWithSuchEmail !== null) {
    return response.status(400).send({
      code   : 'email-not-unique',
      message: 'Email is not unique'
    });
  }

  const userWithSuchUsername = await prisma.user.findFirst({
    where: { username: data.username }
  });

  if (userWithSuchUsername !== null) {
    return response.status(400).send({
      code   : 'username-not-unique',
      message: 'Username is not unique'
    });
  }

  const password    = await bcrypt.hash(data.password, 10);
  const user        = await prisma.user.create({ data: { ...data, password } });
  const accessToken = createAccessToken(user.id);

  response.send({ accessToken });
};

export const signIn = async (request: Request, response: Response) => {
  const data = request.body as ISignInSchema;

  const user = await prisma.user.findFirst({
    where: { email: data.email }
  });

  if (user === null) {
    return response.status(404).send({
      code   : 'user-not-found',
      message: `User not found`
    });
  }

  const isCorrectPassword = await bcrypt.compare(data.password, user.password);

  if (!isCorrectPassword) {
    return response.status(401).send({
      code   : 'invalid-password',
      message: `Password is not valid`
    });
  }

  const accessToken = createAccessToken(user.id);

  response.send({ accessToken });
};

export const getMe = async (request: Request, response: Response) => {
  const user = request.user as User;

  response.send({
    id      : user.id,
    username: user.username,
    email   : user.email
  });
};

export const deleteMe = async (request: Request, response: Response) => {
  const user = request.user as User;

  await prisma.user.delete({
    where: { id: user.id }
  });

  response.send({
    message: 'Your account was deleted'
  });
};
