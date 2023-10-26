import { Router }       from 'express';
import { searchGuides } from '../controllers/search.controller';

export const searchRoute = Router();

searchRoute.get('/guides', searchGuides);
