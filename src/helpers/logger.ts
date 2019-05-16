import * as winston from 'winston';
import { existsSync, mkdirSync } from 'fs';

const dir: string = './logs';

if (!existsSync(dir)) {
  mkdirSync(dir);
}

export const logger = winston.createLogger({
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json(),
  ),
  level: 'debug',
  transports: [
    new winston.transports.File({
      filename: dir + '/app.log',
      maxsize: 4096,
    }),
  ],
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(
    new winston.transports.Console({
      format: winston.format.json(),
    }),
  );
}
