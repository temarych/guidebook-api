import { Router }      from 'express';
import { createGuide } from '../controllers/guide.controller';

export const guideRoute = Router();

guideRoute.post('/', createGuide);
