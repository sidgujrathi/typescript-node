import { verify } from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import config from '../config/config';
import { logger as log } from '../helpers/logger';
import { UserService } from '../components/user/service';
import { IUser } from '../components/user/interface';

export interface IReqAuth extends Request {
  user: string;
}

export const ensureAuth = async (
  req: IReqAuth,
  res: Response,
  next: NextFunction,
) => {
  const token = req.headers.authorization;
  if (!token) {
    return res
      .status(401)
      .send({ success: false, msg: 'Auth headers required', item: {} });
  }
  try {
    const decoded: any = await verify(token, config.JWT_SECRET);
    const user: IUser | null = await new UserService().findById(decoded.sub);
    if (!user) {
      return res
        .status(401)
        .send({ success: false, msg: 'Permission Denied', item: {} });
    }
    req.user = decoded.sub;
    next();
  } catch (err) {
    log.error(err.stack);
    if (err.name === 'TokenExpiredError') {
      return res
        .status(401)
        .send({ success: false, msg: 'Auth token expired', item: err });
    }
    if (err.name === 'JsonWebTokenError') {
      return res
        .status(401)
        .send({ success: false, msg: 'Invalid token', item: err });
    }
    return res
      .status(401)
      .send({ success: false, msg: err.message, item: err });
  }
};
