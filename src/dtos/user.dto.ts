import { type User } from '@prisma/client';

export type IProfileDTO = Omit<User, 'password'>;

export class ProfileDTO implements IProfileDTO {
  public id: string;
  public email: string;
  public username: string;

  constructor (data: IProfileDTO) {
    this.id       = data.id;
    this.email    = data.email;
    this.username = data.username;
  }
}
