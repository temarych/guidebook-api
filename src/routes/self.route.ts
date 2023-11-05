import { Router }         from 'express';
import { selfController } from '../controllers/self.controller';
import { authorize }      from '../middleware/authorize';

export const selfRoute = Router();

selfRoute.get('/', authorize, selfController.getSelf);
selfRoute.delete('/', authorize, selfController.deleteSelf);
selfRoute.get('/guides', authorize, selfController.getMyGuides);
