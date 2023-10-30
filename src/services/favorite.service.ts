import { prisma } from '..';

class FavoriteService {
  public async checkIsGuideFavorite (guideId: string, userId: string) {
    const favorite = await prisma.favorite.findFirst({
      where: { guideId, userId }
    });
    return favorite !== null;
  }

  public async createFavoriteGuide (guideId: string, userId: string) {
    return await prisma.favorite.create({
      data: { guideId, userId }
    });
  }

  public async findFavoriteGuides (userId: string) {
    const favorites = await prisma.favorite.findMany({
      where  : { userId },
      include: { guide: true }
    });
    return favorites.map(favorite => favorite.guide);
  }
}

export const favoriteService = new FavoriteService();
