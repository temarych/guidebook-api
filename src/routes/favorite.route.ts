import { Router }    from 'express';
import { authorize } from '../middleware/authorize';
import {
  addFavoriteGuide,
  getFavoriteGuides,
  removeFavoriteGuide
}                    from '../controllers/favorite.controller';

export const favoriteRoute = Router();

favoriteRoute.put('/:id', authorize, addFavoriteGuide);
favoriteRoute.delete('/:id', authorize, removeFavoriteGuide);
favoriteRoute.get('/', authorize, getFavoriteGuides);
