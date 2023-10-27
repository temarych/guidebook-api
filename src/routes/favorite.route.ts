import { Router }           from 'express';
import { authorize }        from '../middleware/authorize';
import { addFavoriteGuide } from '../controllers/favorite.controller';

export const favoriteRoute = Router();

favoriteRoute.put('/:id', authorize, addFavoriteGuide);
