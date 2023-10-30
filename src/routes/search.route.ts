import { Router }           from 'express';
import { authorize }        from '../middleware/authorize';
import { searchController } from '../controllers/search.controller';

export const searchRoute = Router();

searchRoute.get('/guides', authorize, searchController.searchGuides);
searchRoute.get('/favorite/guides', authorize, searchController.searchFavoriteGuides);
