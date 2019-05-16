import * as mongoose from 'mongoose';
import config from '../config/config';
import { logger as log } from '../helpers/logger';

/**
 * database connection
 */
export class MongoDB {

  constructor() {}

  public connection(): Promise<mongoose.Mongoose> {
    const mongoURL = config.mongoURL;
    // set the global useNewUrlParser option to turn on useNewUrlParser for every connection by default.
    mongoose.set('useNewUrlParser', true);
    // indexes for Mongoose schemas
    mongoose.set('useCreateIndex', true);
    // mongoose debug mode, by default false
    mongoose.set('debug', config.MONGO_DEBUG);

    // handle connected event
    mongoose.connection.on('connected', () => {
      log.info('MongoDB connected');
    });

    // handle error event
    mongoose.connection.on('error', err => {
      log.error('Shutdown service reason: ', err);
      process.exit(0);
    });

    // handle disconnected event
    mongoose.connection.on('disconnected', (err) => {
      log.info('Shutdown service because of MongoDB connection');
      process.exit(0);
    });

    // handle application termination event
    process.on('SIGINT', () => {
      mongoose.connection.close(() => {
        log.info('MongoDB disconnected through application termination.');
        process.exit(0);
      });
    });

    // connecting to db
    return mongoose.connect(mongoURL);
  }
}
