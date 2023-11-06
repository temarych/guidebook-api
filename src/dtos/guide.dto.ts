import { type User as DbUser, type Guide as DbGuide } from '@prisma/client';

export type IGuidePreviewDTO = Omit<DbGuide, 'authorId' | 'image' | 'createdAt'>;

export class GuidePreviewDTO implements IGuidePreviewDTO {
  public id         : string;
  public title      : string;
  public description: string;
  public emoji      : string;

  constructor (data: IGuidePreviewDTO) {
    this.id          = data.id;
    this.title       = data.title;
    this.description = data.description;
    this.emoji       = data.emoji;
  }
}

export interface IGuideDTO extends DbGuide {
  author    : Pick<DbUser, 'username'>;
  isFavorite: boolean;
  likesCount: number;
  createdAt : Date;
}

export class GuideDTO implements IGuideDTO {
  public id         : string;
  public title      : string;
  public description: string;
  public emoji      : string;
  public image      : string;
  public author     : Pick<DbUser, 'username'>;
  public authorId   : string;
  public isFavorite : boolean;
  public likesCount : number;
  public createdAt  : Date;

  constructor (data: IGuideDTO) {
    this.id          = data.id;
    this.title       = data.title;
    this.description = data.description;
    this.emoji       = data.emoji;
    this.image       = data.image;
    this.author      = { username: data.author.username };
    this.authorId    = data.authorId;
    this.isFavorite  = data.isFavorite;
    this.likesCount  = data.likesCount;
    this.createdAt   = data.createdAt;
  }
}
