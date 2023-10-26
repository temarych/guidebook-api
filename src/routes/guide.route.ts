import { Router }                from 'express';
import { createGuide, getGuide } from '../controllers/guide.controller';

export const guideRoute = Router();

guideRoute.post('/', createGuide);
guideRoute.get('/:id', getGuide);
