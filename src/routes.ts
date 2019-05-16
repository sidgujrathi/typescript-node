import { Application, Request, Response } from 'express';
import { UserApi } from './components/user/controller';

export function registerRoutes(app: Application): void {
  app.get('/', (req: Request, res: Response) => {
    const now = new Date();
    return res.status(200).send(now);
  });

  new UserApi().register(app);
}
