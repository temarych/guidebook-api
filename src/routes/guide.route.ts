import { Router }    from 'express';
import {
  addStep,
  createGuide,
  getGuide,
  getSteps
}                    from '../controllers/guide.controller';
import { validate }  from '../middleware/validate';
import { authorize } from '../middleware/authorize';
import {
  createGuideSchema,
  createStepSchema
}                    from '../schemas/guide.schema';

export const guideRoute = Router();

guideRoute.post('/', authorize, validate(createGuideSchema), createGuide);
guideRoute.get('/:guideId', authorize, getGuide);
guideRoute.get('/:guideId/steps', authorize, getSteps);
guideRoute.post('/:guideId/steps', authorize, validate(createStepSchema), addStep);
