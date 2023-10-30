import { type Request, type Response } from 'express';
import { guideService }                from '../services/guide.service';
import { GuidePreviewDTO }             from '../dtos/guide.dto';

class SearchController {
  public async searchGuides (request: Request, response: Response) {
    const query  = request.query.query as string;
    const guides = await guideService.searchGuides(query);

    response.send(guides.map(guide => new GuidePreviewDTO(guide)));
  }
}

export const searchController = new SearchController();
