import { Router }    from 'express';
import { authorize } from '../middleware/authorize';
import {
  addFavoriteGuide,
  getFavoriteGuides,
  removeFavoriteGuide
}                    from '../controllers/favorite.controller';

export const favoriteRoute = Router();

favoriteRoute.put('/guides/:id', authorize, addFavoriteGuide);
favoriteRoute.delete('/guides/:id', authorize, removeFavoriteGuide);
favoriteRoute.get('/guides/', authorize, getFavoriteGuides);
