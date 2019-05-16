import { Application, Request, Response } from 'express';
import { BaseApi } from '../BaseAPI';
import { UserService } from './service';
import { IUser } from './interface';
import { verifyPassword } from './model';
import { logger as log } from '../../helpers/logger';
import { catchErrors } from '../../helpers/errorHandler';
import { createToken } from '../../helpers/token';
import { ensureAuth, IReqAuth } from '../../middleware/auth';
import { validator } from '../../middleware/validator';
import { userValidator } from './schema';
import { ResponseHelper } from '../../helpers/response.helper';
import { IUserResponse } from './interface';
import { Types } from 'mongoose';

export class UserApi extends BaseApi {
  constructor() {
    super();
    this.init();
  }

  /**
   * register
   */
  public register(express: Application) {
    express.use('/api/users', this.router);
  }

  /**
   * create
   */
  public async signup(req: Request, res: Response): Promise<void> {
    const body: IUser = req.body;
    const foundUser: IUser | null = await new UserService().findByEmail(body, {});
    if (foundUser) {
      const result: ResponseHelper = ResponseHelper.errorResponse({
        message: `${foundUser.email} already exists`,
      });
      res.status(409).send(result);
    } else {
      let createdUser: IUser = await new UserService().create(body);
      createdUser = createdUser.toObject();
      const result: IUserResponse = ResponseHelper.successResponse(createdUser);
      res.status(200).send(result);
    }
  }

  /**
   * login
   */
  public async signin(req: Request, res: Response): Promise<void> {
    const body: any = req.body;
    const foundUser: IUser | null = await new UserService().findByEmail(body, {
      salt: 1,
      password: 1,
      iterations: 1,
      firstName: 1,
      lastName: 1,
    });
    if (foundUser) {
      const isVerify = await verifyPassword(
        foundUser.password,
        foundUser.salt,
        foundUser.iterations,
        body.password,
      );
      if (isVerify) {
        const result: ResponseHelper = ResponseHelper.successResponse({
          firstName: foundUser.firstName,
          lastName: foundUser.lastName,
          token: createToken(foundUser._id),
        });
        res.status(200).send(result);
      } else {
        log.error({ message: 'Invalid Password' });
        const result: ResponseHelper = ResponseHelper.errorResponse({
          message: 'Invalid Credentials',
        });
        res.status(401).send(result);
      }
    } else {
      const result: ResponseHelper = ResponseHelper.errorResponse({
        message: 'Invalid Credentials',
      });
      res.status(401).send(result);
    }
  }

  /**
   * get by id;
   * @param id - user id
   */
  public async fetch(req: IReqAuth, res: Response): Promise<void> {
    const id: Types.ObjectId = req.params.id || req.user;
    const foundUser: IUser | null = await new UserService().findById(id);
    const result: ResponseHelper = ResponseHelper.successResponse(foundUser);
    res.status(200).send(result);
  }

  /**
   * get
   */
  public async fetchAll(req: IReqAuth, res: Response): Promise<void> {
    const foundUsers: IUser[] = await new UserService().find();
    const result: ResponseHelper = ResponseHelper.successResponse(foundUsers);
    res.status(200).send(result);
  }

  private init(): void {
    this.router.post(
      '/signup',
      validator(userValidator.create),
      catchErrors(this.signup),
    );
    this.router.post('/signin', catchErrors(this.signin));
    this.router.get('/', ensureAuth, catchErrors(this.fetchAll));
    this.router.get('/profile', ensureAuth, catchErrors(this.fetch));
    this.router.get('/:id', ensureAuth, catchErrors(this.fetch));
  }
}
