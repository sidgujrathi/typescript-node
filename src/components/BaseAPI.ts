import { Application, Router } from 'express';

export abstract class BaseApi {
  protected router: Router;

  protected constructor() {
    this.router = Router();
  }

  public abstract register(express: Application): void;
}
