import { type Guide } from '@prisma/client';
import { prisma }     from '..';

class GuideService {
  public async createGuide (data: Omit<Guide, 'id'>) {
    return await prisma.guide.create({ data });
  }

  public async findGuideById (id: string) {
    return await prisma.guide.findFirst({
      where: { id }
    });
  }

  public async searchGuidesByAuthor (query: string, authorId: string) {
    return await prisma.guide.findMany({
      where: {
        title: {
          contains: query,
          mode    : 'insensitive'
        },
        authorId
      }
    });
  }

  public async searchGuides (query: string) {
    return await prisma.guide.findMany({
      where: {
        title: {
          contains: query,
          mode    : 'insensitive'
        }
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

export const guideService = new GuideService();
