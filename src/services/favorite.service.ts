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

  public async countGuideLikes (guideId: string) {
    return await prisma.favorite.count({
      where: { guideId }
    });
  }

  public async countUserLikes (userId: string) {
    return await prisma.favorite.count({
      where: {
        guide: { authorId: userId }
      }
    });
  }

  public async searchFavoriteGuides (query: string, userId: string) {
    const favoriteGuides = await prisma.guide.findMany({
      where : {
        title: {
          contains: query,
          mode    : 'insensitive'
        },
        favorite: {
          some: { userId }
        }
      }
    });
    return favoriteGuides.map(guide => guide);
  }
}

export const favoriteService = new FavoriteService();
