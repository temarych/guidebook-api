import { Router }                from 'express';
import { getMe, signIn, signUp } from '../controllers/auth.controller';

export const authRoute = Router();

authRoute.post('/signup', signUp);
authRoute.post('/signin', signIn);
authRoute.get('/me', getMe);
