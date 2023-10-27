import { Router }                from 'express';
import { createGuide, getGuide } from '../controllers/guide.controller';
import { validate }              from '../middleware/validate';
import { authorize }             from '../middleware/authorize';
import { createGuideSchema }     from '../models/guide';

export const guideRoute = Router();

guideRoute.post('/', authorize, validate(createGuideSchema), createGuide);
guideRoute.get('/:id', authorize, getGuide);
