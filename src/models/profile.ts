import { type User } from '@prisma/client';

export type IProfile = Omit<User, 'password'>;

export class Profile implements IProfile {
  public username: string;
  public email   : string;
  public id      : string;

  constructor (data: IProfile) {
    this.id       = data.id;
    this.username = data.username;
    this.email    = data.email;
  }
}
