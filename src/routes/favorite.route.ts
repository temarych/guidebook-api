import { Router }             from 'express';
import { authorize }          from '../middleware/authorize';
import { favoriteController } from '../controllers/favorite.controller';

export const favoriteRoute = Router();

favoriteRoute.put('/guides/:guideId', authorize, favoriteController.addFavoriteGuide);
favoriteRoute.delete('/guides/:guideId', authorize, favoriteController.removeFavoriteGuide);
