import { Router }                     from 'express';
import { getMe, signIn, signUp }      from '../controllers/auth.controller';
import { validate }                   from '../middleware/validate';
import { authorize }                  from '../middleware/authorize';
import { signInSchema, signUpSchema } from '../schemas/auth.schema';

export const authRoute = Router();

authRoute.post('/signup', validate(signUpSchema), signUp);
authRoute.post('/signin', validate(signInSchema), signIn);
authRoute.get('/me', authorize, getMe);
