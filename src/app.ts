import express from 'express';
import * as bodyParser from 'body-parser';
import cors from 'cors';
import helmet from 'helmet';
import {
  developmentErrors,
  productionErrors,
  validationErrors,
  notFound,
} from './helpers/errorHandler';
import { logger as log } from './helpers/logger';
import { registerRoutes } from './routes';
import { MongoDB } from './config/db';

// creates and configures an expressJS web server.
export class App {
  // ref to express instance
  public app: express.Application;

  // run configuration methods on the Express instance.
  constructor() {
    this.app = express();
    this.config();
    this.dbConnection();
    // this.routes();
  }

  // configure middleware.
  private config(): void {
    // set helmet for disable well security attack
    this.app.use(helmet());
    // set up cors
    this.app.use(cors());
    // set up public file
    this.app.use(express.static('public'));
    // support application/json type post data
    this.app.use(bodyParser.json({ limit: '10mb' }));
    // support application/x-www-form-urlencoded post data
    this.app.use(
      bodyParser.urlencoded({
        extended: false,
        limit: '10mb',
      }),
    );

    // log request
    this.app.use(
      (
        req: express.Request,
        res: express.Response,
        next: express.NextFunction,
      ) => {
        log.info(`request method = ${req.method}, url = ${req.url}`);
        next();
      },
    );

    /**
     * This is just to get up and running, and to make sure what we've got is
     * working so far. This function will change when we start to add more
     * API endpoints
     */
    registerRoutes(this.app);

    // catch 404
    this.app.use(notFound);

    // One of our error handlers will see if these errors are just validation errors
    this.app.use(validationErrors);

    // Otherwise this was a really bad error we didn't expect!
    if (this.app.get('env') === 'development') {
      /* Development Error Handler - Prints stack trace */
      this.app.use(developmentErrors);
    } else {
      // production error handler
      this.app.use(productionErrors);
    }
  }

  // mongodb connection
  private async dbConnection(): Promise<void> {
    const conn: MongoDB = new MongoDB();
    await conn.connection();
  }
}
