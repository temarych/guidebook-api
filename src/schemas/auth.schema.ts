import { z } from 'zod';

export const signInSchema = z.object({
  email   : z.string(),
  password: z.string()
});

export const signUpSchema = z.object({
  username: z.string(),
  email   : z.string(),
  password: z.string()
});

export type ISignInSchema = z.infer<typeof signInSchema>;
export type ISignUpSchema = z.infer<typeof signUpSchema>;
