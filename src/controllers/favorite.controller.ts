import { type Request, type Response } from 'express';
import { type User }                   from '@prisma/client';
import { favoriteService }             from '../services/favorite.service';
import { GuidePreviewDTO }             from '../dtos/guide.dto';

class FavoriteController {
  public async addFavoriteGuide (request: Request, response: Response) {
    const user            = request.user as User;
    const guideId         = request.params.guideId;
    const isGuideFavorite = await favoriteService.checkIsGuideFavorite(guideId, user.id);

    if (isGuideFavorite) {
      return response.status(400).send({
        code   : 'already-favorite',
        message: 'Guide is already favorite'
      });
    }

    await favoriteService.createFavoriteGuide(guideId, user.id);

    response.send({ message: 'Added guide to favorites' });
  }

  public async removeFavoriteGuide (request: Request, response: Response) {
    const user            = request.user as User;
    const guideId         = request.params.guideId;
    const isGuideFavorite = await favoriteService.checkIsGuideFavorite(guideId, user.id);

    if (isGuideFavorite) {
      return response.status(400).send({
        code   : 'not-favorite',
        message: 'Guide is not favorite'
      });
    }

    await favoriteService.createFavoriteGuide(guideId, user.id);

    response.send({ message: 'Removed guide from favorites' });
  }

  public async getFavoriteGuides (request: Request, response: Response) {
    const user           = request.user as User;
    const favoriteGuides = await favoriteService.findFavoriteGuides(user.id);

    response.send(favoriteGuides.map(guide => new GuidePreviewDTO(guide)));
  }
}

export const favoriteController = new FavoriteController();
