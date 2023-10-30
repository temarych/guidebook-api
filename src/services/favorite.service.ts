import { prisma } from '..';

class FavoriteService {
  public async findFavoriteGuide (guideId: string, userId: string) {
    return await prisma.favorite.findFirst({
      where: { guideId, userId }
    });
  }

  public async createFavoriteGuide (guideId: string, userId: string) {
    return await prisma.favorite.create({
      data: { guideId, userId }
    });
  }

  public async removeFavoriteGuide (favoriteId: string) {
    return await prisma.favorite.delete({
      where: { id: favoriteId }
    });
  }
}

export const favoriteService = new FavoriteService();
