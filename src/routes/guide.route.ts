import { Router }                              from 'express';
import { guideController }                     from '../controllers/guide.controller';
import { validate }                            from '../middleware/validate';
import { authorize }                           from '../middleware/authorize';
import { createGuideSchema, createStepSchema } from '../schemas/guide.schema';

export const guideRoute = Router();

guideRoute.post('/', authorize, validate(createGuideSchema), guideController.createGuide);
guideRoute.get('/:guideId', authorize, guideController.getGuide);
guideRoute.get('/:guideId/steps', authorize, guideController.getSteps);
guideRoute.post('/:guideId/steps', authorize, validate(createStepSchema), guideController.addStep);
