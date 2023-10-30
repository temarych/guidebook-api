import { type Request, type Response } from 'express';
import { type User }                   from '@prisma/client';
import { guideService }                from '../services/guide.service';
import { GuidePreviewDTO }             from '../dtos/guide.dto';

class SearchController {
  public async searchGuides (request: Request, response: Response) {
    const query  = request.query.query as string;
    const guides = await guideService.searchGuides(query);

    response.send(guides.map(guide => new GuidePreviewDTO(guide)));
  }

  public async searchFavoriteGuides (request: Request, response: Response) {
    const user           = request.user as User;
    const query          = request.query.query as string;
    const favoriteGuides = await guideService.searchFavoriteGuides(query, user.id);

    response.send(favoriteGuides.map(guide => new GuidePreviewDTO(guide)));
  }
}

export const searchController = new SearchController();
