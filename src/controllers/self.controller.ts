import { type Request, type Response } from 'express';
import { type User }                   from '@prisma/client';
import { userService }                 from '../services/user.service';
import { guideService }                from '../services/guide.service';
import { ProfileDTO }                  from '../dtos/user.dto';
import { GuidePreviewDTO }             from '../dtos/guide.dto';

class SelfController {
  public async getSelf (request: Request, response: Response) {
    const user       = request.user as User;
    const profileDTO = new ProfileDTO(user);

    response.send({ ...profileDTO });
  }

  public async getMyGuides (request: Request, response: Response) {
    const query    = request.query.query as string;
    const user     = request.user as User;
    const myGuides = await guideService.searchGuidesByAuthor(query, user.id);

    response.send(myGuides.map(guide => new GuidePreviewDTO(guide)));
  }

  public async deleteSelf (request: Request, response: Response) {
    const user = request.user as User;

    await userService.deleteUser(user.id);

    response.send({ message: 'Your account was deleted' });
  }
}

export const selfController = new SelfController();
