import { type User } from '@prisma/client';
import { prisma }    from '..';

class UserService {
  public async findUserByEmail (email: string) {
    return await prisma.user.findFirst({
      where: { email }
    });
  }

  public async findUserByUsername (username: string) {
    return await prisma.user.findFirst({
      where: { username }
    });
  };

  public async findUserById (id: string) {
    return await prisma.user.findFirst({
      where: { id }
    });
  }

  public async createUser (data: Omit<User, 'id'>) {
    return await prisma.user.create({ data });
  }

  public async deleteUser (id: string) {
    return await prisma.user.delete({
      where: { id }
    });
  }
}

export const userService = new UserService();
