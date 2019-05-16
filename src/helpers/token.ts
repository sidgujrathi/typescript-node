import { sign } from 'jsonwebtoken';
import config from '../config/config';

export const createToken = (user: any) => {
  const payload = {
    iss: 'cms-backend',
    sub: user,
    iat: Math.floor(Date.now() / 1000) - 30,
    exp: Math.floor(Date.now() / 1000) + 86400000,
  };
  return sign(payload, config.JWT_SECRET);
};
