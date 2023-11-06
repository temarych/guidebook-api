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

  public async countGuides (authorId: string) {
    return await prisma.guide.count({
      where: { authorId }
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
}

export const guideService = new GuideService();
