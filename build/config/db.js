"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = __importStar(require("mongoose"));
const config_1 = __importDefault(require("../config/config"));
const logger_1 = require("../helpers/logger");
class MongoDB {
    constructor() { }
    connection() {
        const mongoURL = config_1.default.mongoURL;
        mongoose.set('useNewUrlParser', true);
        mongoose.set('useCreateIndex', true);
        mongoose.set('debug', config_1.default.MONGO_DEBUG);
        mongoose.connection.on('connected', () => {
            logger_1.logger.info('MongoDB connected');
        });
        mongoose.connection.on('error', err => {
            logger_1.logger.error('Shutdown service reason: ', err);
            process.exit(0);
        });
        mongoose.connection.on('disconnected', (err) => {
            logger_1.logger.info('Shutdown service because of MongoDB connection');
            process.exit(0);
        });
        process.on('SIGINT', () => {
            mongoose.connection.close(() => {
                logger_1.logger.info('MongoDB disconnected through application termination.');
                process.exit(0);
            });
        });
        return mongoose.connect(mongoURL);
    }
}
exports.MongoDB = MongoDB;
