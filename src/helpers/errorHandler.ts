import { Request, Response, NextFunction } from 'express';
import { MongoError } from 'mongodb';
import * as _ from 'lodash';
/*
  Catch Errors Handler
  With async/await, you need some way to catch errors
  Instead of using try{} catch(e) {} in each controller, we wrap the function in
  catchErrors(), catch and errors they throw, and pass it along to our express middleware with next()
*/

export const catchErrors = (fn: any) => {
  return (req: Request, res: Response, next: NextFunction) => {
    return fn(req, res, next).catch(next);
  };
};

/*
  Not Found Error Handler
  If we hit a route that is not found, we mark it as 404 and pass it along to the next error handler to display
*/
export const notFound = (req: Request, res: Response, next: NextFunction) => {
  res.status(404).send({ success: false, error: 'endpoint not found' });
  // const err: Error = new Error('Not Found');
  // err.name = 'NotFound';
  // next(err);
};

/*
  MongoDB Validation Error Handler
  Detect if there are mongodb validation errors
*/

export const validationErrors = (
  err: MongoError,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  switch (err.name) {
    case 'MongoError':
      if (err.code === 11000) {
        const matchRegex: RegExpMatchArray | null = err.message.match(
          /index\:\ (?:.*\.)?\$?(?:([_a-z0-9]*)(?:_\d*)|([_a-z0-9]*))\s*dup key/i,
        );
        if (matchRegex) {
          const key = matchRegex.length ? matchRegex[1] : '';
          const valueRegex = err.message.match(/key:\s+{\s+:\s\"(.*)(?=\")/);
          const value = valueRegex ? valueRegex[1] : '';
          return res
            .status(409)
            .send({ status: false, message: `${key} '${value}' already exists` });
        }
      }
    case 'CastError':
      return res.status(400).send({ status: false, message: err.message });
    case 'ValidationError':
      return res.status(400).send({ status: false, message: err.message });
    case 'MissingSchemaError':
      return res.status(500).send({ status: false, message: err.message });
    default:
      next(err);
  }
};

/*
  Development Error Handler
*/

export const developmentErrors = (
  err: NodeJS.ErrnoException,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  res.status(500).send({ success: false, err: err.stack });
};

/*
  Production Error Handler
  No stack traces are leaked to user
*/
export const productionErrors = (
  err: NodeJS.ErrnoException,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  res.status(500).send({
    status: 'error',
    message: err.message,
    error: {},
  });
};
