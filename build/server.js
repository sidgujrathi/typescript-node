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
const http = __importStar(require("http"));
const app_1 = require("./app");
const config_1 = __importDefault(require("./config/config"));
const logger_1 = require("./helpers/logger");
const express = new app_1.App();
const port = config_1.default.port;
const env = config_1.default.env;
express.app.set('port', port);
express.app.set('env', env);
const server = http.createServer(express.app);
server.listen(port);
server.on('listening', onListening);
server.on('error', onError);
function onListening() {
    logger_1.logger.info(`Application listening on port ${port} in ${express.app.get('env')} mode`);
}
function onError(error) {
    if (error.syscall !== 'listen') {
        throw error;
    }
    const bind = typeof port === 'string' ? 'Pipe ' + port : 'Port ' + port;
    switch (error.code) {
        case 'EACCES':
            logger_1.logger.error(bind + ' requires elevated privileges');
            process.exit(1);
            break;
        case 'EADDRINUSE':
            logger_1.logger.error(bind + ' is already in use');
            process.exit(1);
            break;
        default:
            throw error;
    }
}
process.on('unhandledRejection', (err, p) => {
    logger_1.logger.error('Unhandled Promise Rejection: reason:', err.message);
    logger_1.logger.error(String(err.stack));
    process.exit(0);
});
