import { Router }       from 'express';
import { searchGuides } from '../controllers/search.controller';
import { authorize }    from '../middleware/authorize';

export const searchRoute = Router();

searchRoute.get('/guides', authorize, searchGuides);
