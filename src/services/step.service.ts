import { type Step } from '@prisma/client';
import { prisma }    from '..';

class StepService {
  public async findSteps (guideId: string) {
    return await prisma.step.findMany({
      where  : { guideId },
      orderBy: { order: 'asc' }
    });
  }

  public async findLastOrder (guideId: string) {
    const result = await prisma.step.aggregate({
      where: { guideId },
      _max : { order: true }
    });

    return result._max.order;
  }

  public async createStep (data: Omit<Step, 'id'>) {
    return await prisma.step.create({
      data: { ...data }
    });
  }

  public async addStep (data: Omit<Step, 'id' | 'order'>) {
    const lastOrder = await this.findLastOrder(data.guideId);
    const order     = lastOrder !== null ? lastOrder + 1 : 1;

    return await this.createStep({ ...data, order });
  }
}

export const stepService = new StepService();
