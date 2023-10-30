import { Router }                     from 'express';
import { authController }             from '../controllers/auth.controller';
import { validate }                   from '../middleware/validate';
import { authorize }                  from '../middleware/authorize';
import { signInSchema, signUpSchema } from '../schemas/auth.schema';

export const authRoute = Router();

authRoute.post('/signup', validate(signUpSchema), authController.signUp);
authRoute.post('/signin', validate(signInSchema), authController.signIn);
authRoute.get('/me', authorize, authController.getMe);
authRoute.delete('/me', authorize, authController.deleteMe);
