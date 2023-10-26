import { type Request, type Response } from 'express';

export const searchGuides = (request: Request, response: Response): void => {
  response.send('Search guides');
};
