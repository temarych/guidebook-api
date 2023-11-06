import { type Request, type Response } from 'express';
import { type User }                   from '@prisma/client';
import {
  type ICreateStepSchema,
  type ICreateGuideSchema
}                                      from '../schemas/guide.schema';
import { GuideDTO, GuidePreviewDTO }   from '../dtos/guide.dto';
import { guideService }                from '../services/guide.service';
import { favoriteService }             from '../services/favorite.service';
import { userService }                 from '../services/user.service';
import { stepService }                 from '../services/step.service';

class GuideController {
  public async createGuide (request: Request, response: Response) {
    const user  = request.user as User;
    const data  = request.body as ICreateGuideSchema;

    const guide = await guideService.createGuide({
      ...data,
      authorId : user.id,
      createdAt: new Date()
    });

    response.send(guide);
  }

  public async getGuide (request: Request, response: Response) {
    const user    = request.user as User;
    const guideId = request.params.guideId;
    const guide   = await guideService.findGuideById(guideId);

    if (guide === null) {
      return response.status(404).send({
        code   : 'guide-not-found',
        message: 'Guide not found'
      });
    }

    const author = await userService.findUserById(guide.authorId);

    if (author === null) {
      return response.status(404).send({
        code   : 'author-not-found',
        message: 'Author not found'
      });
    }

    const likesCount    = await favoriteService.countGuideLikes(guideId);
    const favoriteGuide = await favoriteService.findFavoriteGuide(guideId, user.id);
    const isFavorite    = favoriteGuide !== null;
    const guideDTO      = new GuideDTO({ ...guide, author, isFavorite, likesCount });

    response.send(guideDTO);
  }

  public async getGuides (request: Request, response: Response) {
    const query  = request.query.query as string;
    const guides = await guideService.searchGuides(query);

    response.send(guides.map(guide => new GuidePreviewDTO(guide)));
  }

  public async getSteps (request: Request, response: Response) {
    const guideId = request.params.guideId;
    const guide   = await guideService.findGuideById(guideId);

    if (guide === null) {
      return response.status(404).send({
        code   : 'guide-not-found',
        message: 'Guide not found'
      });
    }

    const steps = await stepService.findSteps(guideId);

    response.send(steps);
  }

  public async addStep (request: Request, response: Response) {
    const data    = request.body as ICreateStepSchema;
    const guideId = request.params.guideId;
    const guide   = await guideService.findGuideById(guideId);

    if (guide === null) {
      return response.status(404).send({
        code   : 'guide-not-found',
        message: 'Guide not found'
      });
    }

    const step = await stepService.addStep({ ...data, guideId });

    response.send(step);
  }
}

export const guideController = new GuideController();
