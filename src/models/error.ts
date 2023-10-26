export interface IHttpError {
  code   : string;
  status : number;
  message: string;
}

export class HttpError extends Error implements IHttpError {
  public code  : string;
  public status: number;

  constructor (error: IHttpError) {
    super(error.message);
    this.code   = error.code;
    this.status = error.status;
  }
}
