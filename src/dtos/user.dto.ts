import { type User } from '@prisma/client';

export interface IProfileDTO extends Omit<User, 'password'> {
  guidesCount: number;
  likesCount : number;
}

export class ProfileDTO implements IProfileDTO {
  public id         : string;
  public email      : string;
  public username   : string;
  public guidesCount: number;
  public likesCount : number;

  constructor (data: IProfileDTO) {
    this.id          = data.id;
    this.email       = data.email;
    this.username    = data.username;
    this.guidesCount = data.guidesCount;
    this.likesCount  = data.likesCount;
  }
}
