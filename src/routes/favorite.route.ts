import { Router }    from 'express';
import { authorize } from '../middleware/authorize';
import {
  addFavoriteGuide,
  getFavoriteGuides
}                    from '../controllers/favorite.controller';

export const favoriteRoute = Router();

favoriteRoute.put('/:id', authorize, addFavoriteGuide);
favoriteRoute.get('/', authorize, getFavoriteGuides);
