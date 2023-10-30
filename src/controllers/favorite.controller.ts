import { type Request, type Response } from 'express';
import { type User }                   from '@prisma/client';
import { favoriteService }             from '../services/favorite.service';

class FavoriteController {
  public async addFavoriteGuide (request: Request, response: Response) {
    const user          = request.user as User;
    const guideId       = request.params.guideId;
    const favoriteGuide = await favoriteService.findFavoriteGuide(guideId, user.id);

    if (favoriteGuide !== null) {
      return response.status(400).send({
        code   : 'already-favorite',
        message: 'Guide is already favorite'
      });
    }

    await favoriteService.createFavoriteGuide(guideId, user.id);

    response.send({ message: 'Added guide to favorites' });
  }

  public async removeFavoriteGuide (request: Request, response: Response) {
    const user          = request.user as User;
    const guideId       = request.params.guideId;
    const favoriteGuide = await favoriteService.findFavoriteGuide(guideId, user.id);

    if (favoriteGuide === null) {
      return response.status(400).send({
        code   : 'not-favorite',
        message: 'Guide is not favorite'
      });
    }

    await favoriteService.removeFavoriteGuide(favoriteGuide.id);

    response.send({ message: 'Removed guide from favorites' });
  }
}

export const favoriteController = new FavoriteController();
