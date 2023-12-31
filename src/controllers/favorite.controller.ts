import { type Request, type Response } from 'express';
import { type User }                   from '@prisma/client';
import { favoriteService }             from '../services/favorite.service';
import { guideService }                from '../services/guide.service';
import { GuidePreviewDTO }             from '../dtos/guide.dto';

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

  public async getFavoriteGuides (request: Request, response: Response) {
    const user           = request.user as User;
    const query          = request.query.query as string;
    const favoriteGuides = await guideService.searchFavoriteGuides(query, user.id);

    response.send(favoriteGuides.map(guide => new GuidePreviewDTO(guide)));
  }
}

export const favoriteController = new FavoriteController();
